import React, { useState, useEffect } from "react";
import "./details.css";
import LogOutButton from "../LogOutButton";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { toast } from "react-toastify";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import GuessModal from "./guessModal/GuessModal";

const Details = () => {
  const { currentUser, decrementHints } = useUserStore();
  const { user } = useChatStore();
  const [userPlayingData, setUserPlayingData] = useState(null);
  const [hints, setHints] = useState({ hintOne: "", hintTwo: "" });
  const [seenHints, setSeenHints] = useState({
    hintOne: false,
    hintTwo: false,
  });

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.is_playing) {
      fetchUserPlayingData(user.is_playing);
    }
  }, [user?.is_playing]);

  useEffect(() => {
    if (user?.id) {
      fetchHints();
      checkHintStatuses();
    }
  }, [user]);

  const fetchUserPlayingData = async (id) => {
    try {
      const userDocRef = doc(db, "users", id);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserPlayingData(userDoc.data());
      } else {
        console.error("User playing data not found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchHints = async () => {
    try {
      const { hint_no1, hint_no2 } = user;
      if (!hint_no1 || !hint_no2) {
        console.error("Hint IDs are missing.");
        return;
      }

      const [hintOneSnap, hintTwoSnap] = await Promise.all([
        getDoc(doc(db, "hints", hint_no1)),
        getDoc(doc(db, "hints", hint_no2)),
      ]);

      setHints({
        hintOne: hintOneSnap.exists()
          ? hintOneSnap.data().hint
          : "Hint not found",
        hintTwo: hintTwoSnap.exists()
          ? hintTwoSnap.data().hint
          : "Hint not found",
      });
    } catch (error) {
      console.error("Error fetching hints:", error);
      toast.error("Failed to fetch hints.");
    }
  };

  const checkHintStatuses = async () => {
    try {
      const { hint_no1, hint_no2 } = user;

      const [isHintOneSeen, isHintTwoSeen] = await Promise.all([
        checkHintStatus(hint_no1),
        checkHintStatus(hint_no2),
      ]);

      setSeenHints({ hintOne: isHintOneSeen, hintTwo: isHintTwoSeen });
    } catch (error) {
      console.error("Error checking hint statuses:", error);
    }
  };

  const checkHintStatus = async (hintId) => {
    try {
      const hintRef = doc(db, "hints", hintId);
      const hintSnap = await getDoc(hintRef);

      if (hintSnap.exists()) {
        return hintSnap.data().isSeenBy?.includes(currentUser.id) || false;
      }
    } catch (error) {
      console.error("Error checking hint status:", error);
    }
    return false;
  };

  const handleShowHint = async (hintType) => {
    if (currentUser.no_of_hints <= 0) {
      toast.error("You don't have enough hints!");
      return;
    }

    try {
      const hintId = hintType === "hintOne" ? user.hint_no1 : user.hint_no2;
      if (!hintId) return;

      const hintRef = doc(db, "hints", hintId);
      await updateDoc(hintRef, {
        isSeenBy: arrayUnion(currentUser.id),
      });

      setSeenHints((prev) => ({
        ...prev,
        [hintType]: true,
      }));

      decrementHints();
    } catch (error) {
      console.error("Error updating hint visibility:", error);
      toast.error("Failed to reveal the hint.");
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleGuess = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="detail">
      <div className="userDetailSection">
        <img
          src={userPlayingData?.avatar || "/avatar.png"}
          alt={`${userPlayingData?.username || "User"}'s avatar`}
        />
        <h2>{userPlayingData?.username || "Loading..."}</h2>
        <div className="hints_box">
          <div>
            {seenHints.hintOne ? (
              <p className="hint">{hints.hintOne}</p>
            ) : (
              <button
                className="hint_btn"
                onClick={() => handleShowHint("hintOne")}
              >
                Show the 1st hint
              </button>
            )}
          </div>
          <div>
            {seenHints.hintTwo ? (
              <p className="hint">{hints.hintTwo}</p>
            ) : (
              <button
                className="hint_btn"
                onClick={() => handleShowHint("hintTwo")}
              >
                Show the 2nd hint
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Did you figure out who this is?</span>
          </div>
        </div>
        <button className="btn btn-tertiary" onClick={handleGuess}>
          Click here then
        </button>
        <button onClick={handleGoBack} className="btn btn-secondary">
          Go back
        </button>
        <LogOutButton />
      </div>
      {isModalOpen && (
        <GuessModal
          handleCloseModal={handleCloseModal}
          fakeIdentity={userPlayingData}
        />
      )}
    </div>
  );
};

export default Details;
