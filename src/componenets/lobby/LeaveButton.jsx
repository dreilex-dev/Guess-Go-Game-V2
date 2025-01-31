import React from "react";
import "./leaveButton.css";
import "../details/details.css";

const LeaveButton = ({ onLeave }) => {
  return (
    <button className="leave-button" onClick={onLeave}>
      Leave
    </button>
  );
};

export default LeaveButton;