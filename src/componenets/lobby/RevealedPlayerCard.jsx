import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import "./revealedPlayerCard.css";

const RevealedPlayerCard = ({ player, rank }) => {
  const [playingAs, setPlayingAs] = useState("");
  const [points, setPoints] = useState(0);

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return { 
          border: "1px solid #FFD700", // Gold
          boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)", // Blur effect pentru gold
          text: "Winner"
        }; 
      case 2:
        return { 
          border: "1px solid #C0C0C0", // Silver
          boxShadow: "0 0 10px rgba(192, 192, 192, 0.5)", // Blur effect pentru silver
          text: "2nd Place"
        }; 
      case 3:
        return { 
          border: "1px solid #CD7F32", // Bronze
          boxShadow: "0 0 10px rgba(205, 127, 50, 0.5)", // Blur effect pentru bronze
          text: "3rd Place"
        }; 
      default:
        return { 
          border: "none", 
          boxShadow: "none",
          text: "" 
        }; 
    }
  };

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // Obține punctele utilizatorului
        const userDocRef = doc(db, "users", player.id);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setPoints(userDoc.data().points || 0);
        }

        // Obține identitatea falsă
        if (player.is_playing) {
          const fakeIdentityRef = doc(db, "users", player.is_playing);
          const fakeIdentityDoc = await getDoc(fakeIdentityRef);
          if (fakeIdentityDoc.exists()) {
            setPlayingAs(fakeIdentityDoc.data().username);
          }
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };

    fetchPlayerData();
  }, [player.id, player.is_playing]);

  const rankStyle = getRankStyle(rank);

  return (
    <div className="player-card-container">
      <div 
        className="handle" 
        style={{ 
          border: rankStyle.border,
          boxShadow: rankStyle.boxShadow,
          color: "#FFFFFF" // Text alb pentru toate pozițiile
        }}
      >
        <span>
          {rankStyle.text} {rankStyle.text && "- "}
          {points} Points
        </span>
      </div>
      <img
        src={player.avatar}
        alt="Player avatar"
        className="player-avatar"
      />
      <div className="player-info">
        <div className="playing-as revealed-info">
          Alias: @{playingAs}
        </div>
        <div className="real-username show">
          True Identity: {player.username}
        </div>
      </div>
    </div>
  );
};

export default RevealedPlayerCard;