import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../lib/userStore";
import UserModal from "./userModal/UserModal";

const GameLobby = () => {
  const [showModal, setShowModal] = useState(
    localStorage.getItem("modalShown") ? false : true
  );
  const { currentUser, setCurrentUser } = useUserStore();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/chat_room");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem("modalShown", "true");
  };

  return (
    <>
      {/***here you code */}
      <div className="game-lobby">
        <h1>Game Lobby</h1>
        <button onClick={handleNavigate} className="navigate-btn">
          Go to Chat Room
        </button>
      </div>
      {/**Till here  */}
      <UserModal display={showModal} handleCloseModal={handleCloseModal} />
    </>
  );
};

export default GameLobby;
