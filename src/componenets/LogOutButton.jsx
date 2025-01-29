import React, { useState } from "react";
import { toast } from "react-toastify";
import { useUserStore } from "../lib/userStore";

const LogOutButton = () => {
  const { resetUser } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    try {
      resetUser();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("An error occurred while logging out.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button className="btn btn-primary leave-button-size" onClick={openModal}>
        Leave the game
      </button>

      {isModalOpen && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="modal"
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="card">
              <h2
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                  color: "gray",
                }}
              >
                Are you sure you want to leave the game?
              </h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <button
                  className="btn btn-primary"
                  style={{
                    padding: "10px 20px",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleLogout();
                    closeModal();
                  }}
                >
                  Yes
                </button>
                <button
                  className="btn btn-secondary"
                  style={{
                    padding: "10px 20px",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={closeModal}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogOutButton;
