import React, { useState } from "react";
import "./gameCode.css";
import "../details/details.css";

const GameCode = ({ gameCode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(gameCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000); 
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };
  return (
    <div className="btn btn-secondary game-code-gradient" onClick={handleCopy} title="Click to copy">
      <span className="game-code">ID: {gameCode}</span>
      {copied && <span className="copy-feedback">Copied!</span>}
    </div>
  );
};

export default GameCode;
