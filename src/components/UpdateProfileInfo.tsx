import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default async function updateUserAfterFeedback(
  userId: string,
  feedbackScore: number
) {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Document exists, update it
      const userData = userDoc.data();
      let currentHealth = userData.health || 5;
      let currentLevel = userData.plantLevel || 1;
      let questionsAnswered = (userData.questionsAnswered || 0) + 1;

      // Update health based on feedback score
      if (feedbackScore >= 5) {
        currentHealth = Math.min(5, currentHealth + 1);
      } else if (feedbackScore <= 4) {
        currentHealth = Math.max(1, currentHealth - 1);
      }

      // Update level based on questions answered
      if (questionsAnswered >= 15 && currentLevel < 3) {
        currentLevel = 3;
      } else if (questionsAnswered >= 5 && currentLevel < 2) {
        currentLevel = 2;
      }

      await updateDoc(userRef, {
        health: currentHealth,
        plantLevel: currentLevel,
        questionsAnswered: questionsAnswered,
        lastUpdated: new Date(),
      });
    } else {
      // Document doesn't exist, create it
      await setDoc(userRef, {
        health: 5,
        plantLevel: 1,
        questionsAnswered: 1,
        createdAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
