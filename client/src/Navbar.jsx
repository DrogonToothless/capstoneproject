import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
     {/* Navbar content will go here */}
     <p className="nav_left">Welcome, User!</p>
  
     <div className="nav_right">
        <a href="/courses">Courses</a>
        <a href="/profile">Profile</a>
        <a href="/">Log Out</a>
     </div>
    </nav>
  );
}

export default Navbar;
