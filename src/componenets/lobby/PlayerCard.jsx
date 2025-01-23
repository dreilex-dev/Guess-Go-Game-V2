import React from "react";
import "./playerCard.css";

const PlayerCard = ({ avatar, username, playingAs }) => {
  return (
    <div className="player-card-container">
      <img
        src={avatar}
        alt="Player avatar"
        className="player-avatar"
      />
      <div className="playing-as">Playing as: @{playingAs}</div>
      <div className="real-username hidden">Real name:@{username}</div>
    </div>
  );
};

export default PlayerCard;
