import React from "react";
import "./Navbar.css";

export default function Navbar({ toggleDarkMode, darkMode }) {
  return (
    <div className="navbar">
      <div className="nav-logo">SysStock</div>
      <div className="mode-toggle">
        <button onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  );
}