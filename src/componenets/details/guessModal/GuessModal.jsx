import React, { useState } from "react";
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";
import "./guessModal.css";
import { toast } from "react-toastify";

const GuessModal = ({ handleCloseModal, fakeIdentity }) => {
  const { currentUser, addGuess } = useUserStore();
  const { user } = useChatStore();
  const [guess, setGuess] = useState("");

  const handleSubmit = () => {
    if (!guess.trim()) {
      toast.error("Please enter a guess!");
      return;
    }
    addGuess(user.id, guess);
    setGuess("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <img
          className="close-btn"
          src="./close.webp"
          alt="close"
          onClick={handleCloseModal}
        />
        <div className="card">
          <h2>Hey, {currentUser.username}</h2>
          <h3>How you think {fakeIdentity.username} is?</h3>
          <img
            src={fakeIdentity?.avatar || "./avatar.png"}
            alt="User Avatar"
            className="avatar"
          />
        </div>
        <div className="input">
          <input
            className="guess-input"
            type="text"
            value={guess}
            onKeyDown={handleKeyDown}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Type your guess here..."
          />
          <button className="btn btn-secondary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuessModal;
