import React from "react";
import { Link } from "react-router-dom";
import "./BottomNav.css";

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <Link to="/">🏠 Dashboard</Link>
      <Link to="/feedback">💬 Feedback</Link>
      <Link to="/profile">👤 Profile</Link>
    </nav>
  );
}
