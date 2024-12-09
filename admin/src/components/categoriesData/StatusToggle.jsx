import React from 'react';
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

const StatusToggle = ({ status, onToggle }) => {
  return (
    <span className="inline-block align-text-bottom">
      {status === 'active' ? <FaToggleOn size={18} color='green'/> : <FaToggleOff size={18} color='red'/>}
    </span>
  );
};

export default StatusToggle;
