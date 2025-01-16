import React from "react";
import { useNavigate } from "react-router-dom";
import Lobby from "./lobby/Lobby";
import "./lobby/lobby.css";

const GameLobby = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/chat_room");
  };

  return (
    <div className="game-lobby-container">
      {/* <h1>Game Lobby</h1> */}
      {/* <button onClick={handleNavigate}>Go to Chat Room</button> */}
      <Lobby />
    </div>
  );
};

export default GameLobby;
