import React, { useEffect, useState } from 'react';
import './timer.css';

const Timer = ({ players }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const totalTime = players.length * 2 * 60;
    setTimeLeft(totalTime);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [players.length]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const totalTime = players.length * 2 * 60;
  const progress = timeLeft / totalTime;
  
  const getTimerColor = () => {
    if (timeLeft > totalTime / 2) return '#06d6a0';
    if (timeLeft > 60) return '#ffa500';
    return '#ff4d4d';
  };

  return (
    <div className="timer-container">
      <div 
        className={`timer ${timeLeft <= 60 ? 'ending' : ''}`}
        style={{
          '--progress': progress,
          '--timer-color': getTimerColor()
        }}
      >
        {formattedTime}
      </div>
    </div>
  );
};

export default Timer;
