import React from "react";
import "./revealedPlayerCard.css";

const RevealedPlayerCard = ({ player }) => {
  return (
    <div className="player-card-container revealed">
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
          <span className="real-player-label">True Identity: </span>
          <span className="username-text">{player.username}</span>
        </div>
      </div>
    </div>
  );
};

export default RevealedPlayerCard;