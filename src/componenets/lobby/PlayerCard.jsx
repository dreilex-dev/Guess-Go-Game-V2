import React from "react";
import "./playerCard.css";
import RealUsername from "./RealUsername";

const PlayerCard = ({ avatar, username, playingAs }) => {
  return (
    <div className="player-card-container">
      <img
        src={avatar}
        alt="Player avatar"
        className="player-avatar"
      />
      <div className="playing-as">Playing as: @{playingAs}</div>
      <RealUsername username={username} />
    </div>
  );
};

export default PlayerCard;
