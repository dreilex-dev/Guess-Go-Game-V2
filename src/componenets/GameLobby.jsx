import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lobby from "./lobby/Lobby";
import "./lobby/lobby.css";
import { useUserStore } from "../lib/userStore";
import UserModal from "./userModal/UserModal";

const GameLobby = () => {
  const [showModal, setShowModal] = useState(false);
  const { currentUser} = useUserStore();

  useEffect(() => {
    if (currentUser) {
      const modalShownKey = `modalShown_${currentUser.id}`;
      if (!localStorage.getItem(modalShownKey)) {
        setShowModal(true);
      }
    }
  }, [currentUser]);


  const handleCloseModal = () => {
    setShowModal(false);
    if (currentUser?.id) {
      localStorage.setItem(`modalShown_${currentUser.id}`, "true");
    }
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
