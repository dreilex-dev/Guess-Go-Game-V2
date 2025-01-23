import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';
import './timer.css';

const Timer = ({ players }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (!currentUser?.game_code) return;

    const lobbyRef = doc(db, "gameLobby", currentUser.game_code);
    let timerInterval;

    const unsubscribe = onSnapshot(lobbyRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        console.log("Timer data:", data);

        // Verificăm dacă jocul este în starea "ready"
        if (data.gameState === "ready") {
          // Inițializăm timer-ul dacă nu există
          if (!data.timerStart || !data.timerDuration) {
            const calculatedTime = players.length * 2 * 60;
            console.log("Initializing timer with:", calculatedTime);
            
            try {
              await updateDoc(lobbyRef, {
                timerStart: Date.now(),
                timerDuration: calculatedTime
              });
            } catch (error) {
              console.error("Error updating timer:", error);
            }
          } else {
            // Calculăm timpul rămas
            const elapsed = Math.floor((Date.now() - data.timerStart) / 1000);
            const remaining = Math.max(0, data.timerDuration - elapsed);
            setTimeLeft(remaining);
            setTotalTime(data.timerDuration);

            // Setăm intervalul pentru actualizare
            if (timerInterval) clearInterval(timerInterval);
            
            timerInterval = setInterval(() => {
              const newElapsed = Math.floor((Date.now() - data.timerStart) / 1000);
              const newRemaining = Math.max(0, data.timerDuration - newElapsed);
              setTimeLeft(newRemaining);

              if (newRemaining === 0) {
                clearInterval(timerInterval);
              }
            }, 1000);
          }
        }
      }
    });

    return () => {
      unsubscribe();
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [currentUser?.game_code, players]);

  // Nu afișăm nimic dacă nu avem timp
  if (!timeLeft && !totalTime) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

  const getTimerClass = () => {
    if (timeLeft === 0) return 'timer-ended';
    if (percentage > 50) return 'timer-safe';
    if (percentage > 25) return 'timer-warning';
    return 'timer-danger';
  };

  return (
    <div className={`timer ${getTimerClass()}`}>
      {timeLeft === 0 ? (
        "Time's up!"
      ) : (
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )}
    </div>
  );
};

export default Timer;
