import React from "react";
import "./playerCard.css";

const PlayerCard = ({ avatar }) => {
  return (
    <div className="player-card-container">
      <img
        src={avatar}
        alt="Player avatar"
        className="player-avatar"
      />
    </div>
  );
};

export default PlayerCard;
