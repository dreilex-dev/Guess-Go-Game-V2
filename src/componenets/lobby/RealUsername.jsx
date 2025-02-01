import React, { useEffect, useRef } from 'react';
import "./playerCard.css";

const RealUsername = ({ username }) => {
  const realNameRef = useRef(null);

  useEffect(() => {
    if (realNameRef.current) {
      realNameRef.current.classList.add('hidden');
      
      const showRealName = () => {
        if (realNameRef.current) {
          realNameRef.current.classList.remove('hidden');
        }
      };
      
      window.addEventListener('showRealNames', showRealName);
      
      return () => window.removeEventListener('showRealNames', showRealName);
    }
  }, []);

  return (
    <div className="real-username" ref={realNameRef}>
      <span className="real-player-label">Real player:</span>
      <span className="username-text">{username}</span>
    </div>
  );
};

export default RealUsername;