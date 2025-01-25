import React from "react";
import "./playerCard.css";
import RealUsername from "./RealUsername";
import playerImage from "./img/4.png";

const PlayerCard = ({ player,avatar, username, playingAs }) => {
  return (
    <div className="player-card-container">
      <img
        src={playerImage}
        alt="Player avatar"
        className="player-avatar"
      />
      <div className="playing-as">
        Alias: @{player.playingAs}
        </div>
    </div>
  );
};

export default PlayerCard;
