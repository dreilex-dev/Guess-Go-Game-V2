import React from "react";
import "./leaveButton.css";
import "../details/details.css";

const LeaveButton = ({ onLeave }) => {
  return (
    <button className="btn btn-primary leave-button-size" onClick={onLeave}>
      Leave
    </button>
  );
};

export default LeaveButton;