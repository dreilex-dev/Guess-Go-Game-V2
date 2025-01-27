import React, { useState, useEffect } from "react";
import { useScores } from "../../../context/ScoreContext";
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import "./guessModal.css";
import { toast } from "react-toastify";

const GuessModal = ({ handleCloseModal }) => {
  const { currentUser } = useUserStore();
  const { user } = useChatStore();
  const [guess, setGuess] = useState("");
  const { scores, setScores } = useScores();
  const [fakeIdentity, setFakeIdentity] = useState(null);

  useEffect(() => {
    const fetchPlayingAs = async () => {
      if (user.is_playing) {
        const userDocRef = doc(db, "users", user.is_playing);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setFakeIdentity(userDoc.data());
        } else {
          console.error("User document not found.");
        }
      }
    };
    fetchPlayingAs();
  }, [user.is_playing]);

  const handleSubmit = () => {
    if (!guess.trim()) {
      toast.error("Please enter a guess!");
      return;
    }

    addGuess(user.id, guess);
    setGuess("");
    handleCloseModal();
  };

    if (!fakeIdentity || !fakeIdentity.username) {
      toast.error("Player identity not found!");
      return;
    }

    const normalizedGuess = guess.trim().toLowerCase();
    const normalizedUsername = fakeIdentity.username.trim().toLowerCase();

    console.log("Guess:", normalizedGuess, "Username:", normalizedUsername);

    if (normalizedGuess === normalizedUsername) {
      setScores((prevScores) => {
        const currentScore = prevScores[currentUser.id] || 0;
        const updatedScores = {
          ...prevScores,
          [currentUser.id]: currentScore + 20,
        };
        console.log("Updated Scores:", updatedScores);
        return updatedScores;
      });
      toast.success("Correct guess!");
    } else {
      setScores((prevScores) => {
        const currentScore = prevScores[currentUser.id] || 0;
        const updatedScores = {
          ...prevScores,
          [currentUser.id]: currentScore - 5,
        };
        console.log("Updated Scores:", updatedScores);
        return updatedScores;
      });
      toast.error("Wrong guess!");
    }

    setGuess(""); // Resetează inputul
    handleCloseModal(); // Închide modalul
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
          <h3>How you think {fakeIdentity?.username} is?</h3>
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
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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
