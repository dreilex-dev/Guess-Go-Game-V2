import React from "react";
import "./revealedPlayerCard.css";

const RevealedPlayerCard = ({ player }) => {
  return (
    <div className="player-card-container">
      <div className="handle">
        <span>10 Points</span>
      </div>
      <img
        src={player.avatar}
        alt="Player avatar"
        className="player-avatar"
      />
      <div className="player-info">
        <div className="playing-as revealed-info">
        Alias: @{player.playingAs}
        </div>
        <div className="real-username show">
        True Identity: @{player.username}
        </div>
      </div>
    </div>
  );
};

export default RevealedPlayerCard;