import React from "react";
import "./playerCard.css";

const PlayerCard = ({ avatar, username }) => {
  return (
    <div className="player-card-container">
      <img
        src={avatar}
        alt="Player avatar"
        className="player-avatar"
      />
      <div className="player-username hidden">@{username}</div>
    </div>
  );
};

export default PlayerCard;
