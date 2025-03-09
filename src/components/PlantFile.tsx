"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function PlantUpdate({ width = 400, height = 800 }) {
  const [plantLevel, setPlantLevel] = useState(1); // Default to level 1
  const { user } = useUser(); // Get user info from Clerk

  useEffect(() => {
    const fetchPlantLevel = async () => {
      if (!user) return; // Exit if user is not logged in

      try {
        const userRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setPlantLevel(userDoc.data().plantLevel || 1);
        }
      } catch (error) {
        console.error("Error fetching plant level:", error);
      }
    };

    fetchPlantLevel();
  }, [user]);

  // Function to get the correct plant image based on level
  const getPlantImage = () => {
    switch (plantLevel) {
      case 1:
        return "/p1s1.png";
      case 2:
        return "/p1s2.png";
      case 3:
        return "/p1s3.png";
      default:
        return "/p1s1.png"; // Default plant image
    }
  };

  return <Image src={getPlantImage()} width={width} height={height} alt="Plant" />;
}
