import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';
import './timer.css';

const Timer = ({ players }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (!currentUser?.game_code) return;

    const lobbyRef = doc(db, "gameLobby", currentUser.game_code);

    const unsubscribe = onSnapshot(lobbyRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        
        // Verificăm dacă gameState este "ready"
        if (data.gameState === "ready") {
          // Dacă nu există timer, îl inițializăm
          if (!data.timerStart) {
            const totalTime = players.length * 2 * 60;
            console.log("Starting timer for", players.length, "players:", totalTime, "seconds");
            
            await updateDoc(lobbyRef, {
              timerStart: Date.now(),
              timerDuration: totalTime
            });
          } else {
            // Calculăm timpul rămas
            const elapsed = Math.floor((Date.now() - data.timerStart) / 1000);
            const remaining = Math.max(0, data.timerDuration - elapsed);
            setTimeLeft(remaining);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser?.game_code, players.length]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="timer">
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};

export default Timer;
