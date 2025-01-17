import React, { useState } from "react";
import Lobby from "./lobby/Lobby";
import "./lobby/lobby.css";
import { useUserStore } from "../lib/userStore";
import UserModal from "./userModal/UserModal";

const GameLobby = () => {
  const [showModal, setShowModal] = useState(
    localStorage.getItem("modalShown") ? false : true
  );
  const { currentUser } = useUserStore();

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem("modalShown", "true");
  };

  return (
    <>
      <div className="game-lobby-container">
        <Lobby />
      </div>
      <UserModal display={showModal} handleCloseModal={handleCloseModal} />
    </>
  );
};

export default GameLobby;
