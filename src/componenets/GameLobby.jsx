import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lobby from "./lobby/Lobby";
import "./lobby/lobby.css";
import { useUserStore } from "../lib/userStore";
import UserModal from "./userModal/UserModal";

const GameLobby = ({ setShowLoader }) => {
  const [showModal, setShowModal] = useState(
    localStorage.getItem("modalShown") ? false : true
  );

  const { currentUser, setCurrentUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    setShowLoader(true);
  }, []);

  const handleNavigate = () => {
    navigate("/chat_room");
  };

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
