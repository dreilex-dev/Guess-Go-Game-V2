import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useUserStore } from "../../lib/userStore";
import { db } from "../../lib/firebase";
import "./userModal.css";

const UserModal = ({ display, handleCloseModal }) => {
  const { currentUser, setCurrentUser, gameState } = useUserStore();
  const [userPlayingData, setUserPlayingData] = useState(null);

  useEffect(() => {
    if (!currentUser?.id) return;

    const userDocRef = doc(db, "users", currentUser.id);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setCurrentUser({ ...docSnapshot.data(), id: docSnapshot.id });
        }
      },
      (error) => console.error("Error listening to currentUser changes:", error)
    );

    return unsubscribe;
  }, [currentUser?.id, setCurrentUser]);

  useEffect(() => {
    if (!currentUser?.is_playing) {
      setUserPlayingData(null);
      return;
    }

    const playingDocRef = doc(db, "users", currentUser.is_playing);
    const unsubscribe = onSnapshot(
      playingDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setUserPlayingData(docSnapshot.data());
        } else {
          setUserPlayingData(null);
        }
      },
      (error) =>
        console.error("Error listening to playing user changes:", error)
    );

    return unsubscribe;
  }, [currentUser?.is_playing]);

  if (!userPlayingData) {
    return <div>Loading user info...</div>;
  }
  return (
    <>
      {display && (
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
              <h3>You are playing as {userPlayingData.username}</h3>
              <img
                src={userPlayingData?.avatar || "./avatar.png"}
                alt="User Avatar"
                className="avatar"
              />
              <h3>{userPlayingData?.username || "Guest"}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserModal;
