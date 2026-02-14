import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar py-3 px-4">
      <h2 className="logo"><Link to="/">MyApp</Link></h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products"
          className="ps-3 pe-5 py-2 rounded w-100" />
        <i className="fa-solid fa-magnifying-glass text-black" style={{ position: "absolute", top: "15px", right: "20px" }}></i>
      </div>
      <button 
        className="hamburger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <i className="fa-solid fa-bars"></i>
      </button>
      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}
