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
      {username}
    </div>
  );
};

export default RealUsername;