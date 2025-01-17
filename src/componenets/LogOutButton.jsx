import React from "react";
import { toast } from "react-toastify";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useUserStore } from "../lib/userStore";

const LogOutButton = () => {
  const { resetUser } = useUserStore();

  const handleLogout = () => {
    try {
      resetUser();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("An error occurred while logging out.");
    }
  };
  return (
    <button className="logOutBtn btn-secondary" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogOutButton;
