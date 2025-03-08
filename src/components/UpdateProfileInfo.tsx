import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// Make this a regular function, not a hook
export default async function updateUserAfterFeedback(
  userId: string,
  feedbackScore: number
) {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      let currentHealth = userData.health || 5; // Default to 5 if not set
      let currentLevel = userData.plantLevel || 1; // Default to 1 if not set
      let questionsAnswered = (userData.questionsAnswered || 0) + 1;

      // Update health based on feedback score
      if (feedbackScore >= 8) {
        currentHealth = Math.min(5, currentHealth + 1); // Max 5
      } else if (feedbackScore <= 4) {
        currentHealth = Math.max(1, currentHealth - 1); // Min 1
      }

      // Update level based on questions answered
      if (questionsAnswered >= 15 && currentLevel < 3) {
        currentLevel = 3;
      } else if (questionsAnswered >= 5 && currentLevel < 2) {
        currentLevel = 2;
      }

      // Update the document
      await updateDoc(userRef, {
        health: currentHealth,
        plantLevel: currentLevel,
        questionsAnswered: questionsAnswered,
        lastUpdated: new Date(),
      });

      return {
        health: currentHealth,
        plantLevel: currentLevel,
        questionsAnswered: questionsAnswered,
      };
    } else {
      // Create user profile if it doesn't exist
      await updateDoc(userRef, {
        health: 5,
        plantLevel: 1,
        questionsAnswered: 1,
        createdAt: new Date(),
      });
      return { health: 5, plantLevel: 1, questionsAnswered: 1 };
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
