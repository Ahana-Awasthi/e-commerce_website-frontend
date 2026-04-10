// src/components/Nav.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

export default function NavBar({ searchInput, setSearchInput }) {
  const { auth } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // sync auth state from context
  useEffect(() => {
    setToken(auth.token);
    setUserName(auth.user.name || "");
  }, [auth]);

  // also listen to localStorage changes for backward compatibility
  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));
      setUserName(localStorage.getItem("userName"));
    };
    window.addEventListener("authChanged", syncAuth);
    return () => window.removeEventListener("authChanged", syncAuth);
  }, []);

  const handleSearch = (query) => {
    const cleaned = query.trim();
    if (cleaned === "") {
      // remove query params, keep same page
      navigate(location.pathname);
      return;
    }
    if (!query.trim()) return;
    // 🚨 THIS is what you're missing

    // Detect current category from URL
    const currentPath = location.pathname.toLowerCase();
    let currentCategory = null;
    if (currentPath.includes("/shop/women")) currentCategory = "Shop/Women";
    else if (currentPath.includes("/shop/men")) currentCategory = "Shop/Men";
    else if (currentPath.includes("/shop/kids")) currentCategory = "Shop/Kids";
    else if (currentPath.includes("/Sshop/beauty")) currentCategory = "Shop/Beauty";
    else if (currentPath.includes("/shop/electronics"))
      currentCategory = "Shop/Electronics";
    else if (currentPath.includes("shop/home")) currentCategory = "Shop/Home";

    // Map category keywords to categories
    const categoryMap = {
      women: "Shop/Women",
      woman: "Shop/Women",
      lady: "Shop/Women",
      ladies: "Shop/Women",
      girl: "Shop/Women",
      ladki: "Shop/Women",
      ladkiyo: "Shop/Women",
      men: "Shop/Men",
      man: "Shop/Men",
      boy: "Shop/Men",
      ladka: "Shop/Men",
      ladko: "Shop/Men",
      kids: "Shop/Kids",
      kid: "Shop/Kids",
      child: "Shop/Kids",
      children: "Shop/Kids",
      baby: "Shop/Kids",
      toddler: "Shop/Kids",
      bachcha: "Shop/Kids",
      bachcho: "Shop/Kids",
      beauty: "Shop/Beauty",
      cosmetic: "Shop/Beauty",
      makeup: "Shop/Beauty",
      electronics: "Shop/Electronics",
      gadget: "Shop/Electronics",
      device: "Shop/Electronics",
      tech: "Shop/Electronics",
      home: "Shop/Home",
      furniture: "Shop/Home",
      decor: "Shop/Home",
    };

    const words = query.trim().toLowerCase().split(/\s+/);
    const foundCategories = new Set();
    const searchWords = [];

    // Separate category words from search words
    words.forEach((word) => {
      if (categoryMap[word]) {
        foundCategories.add(categoryMap[word]);
      } else {
        searchWords.push(word);
      }
    });

    // Handle different scenarios
    if (foundCategories.size > 1) {
      // Multiple categories found → Go to Redirect with availablePages
      const categoryArray = Array.from(foundCategories);
      localStorage.setItem("availablePages", JSON.stringify(categoryArray));
      navigate(
        `/Redirect?fullQuery=${encodeURIComponent(query.trim())}&searchQuery=${encodeURIComponent(searchWords.join(" "))}`,
      );
      return;
    }

    // Determine target category
    const targetCategory =
      foundCategories.size === 1
        ? Array.from(foundCategories)[0]
        : currentCategory;

    if (targetCategory) {
      navigate(
        `/${targetCategory}?fullQuery=${encodeURIComponent(query.trim())}&searchQuery=${encodeURIComponent(searchWords.join(" "))}`,
      );
    } else {
      // No category and not on a category page → go to Redirect
      navigate(
        `/Redirect?fullQuery=${encodeURIComponent(query.trim())}&searchQuery=${encodeURIComponent(searchWords.join(" "))}`,
      );
    }
  };

  return (
    <nav className="navbar d-flex align-items-center justify-content-between px-3 py-3">
      <h2 className="logo mb-0">
        <Link to={token ? "/dashboard" : "/"} style={{ color: "white" }}>
          MyApp
        </Link>
      </h2>

      <div className="search-container flex-grow-1 mx-3">
        <input
          type="text"
          placeholder="Search products"
          className="search-input"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(searchInput)}
        />
        <i
          className="fa-solid fa-magnifying-glass search-icon"
          onClick={() => handleSearch(searchInput)}
          style={{ cursor: "pointer" }}
        ></i>
      </div>

      {token && (
        <Link to="/profile" className="profile-link">
          <i className="fa-solid fa-user"></i>
          <span className="ms-2 d-none d-lg-inline">{userName}</span>
        </Link>
      )}

      {!token && (
        <>
          <button
            className="hamburger d-flex d-lg-none align-items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fa-solid ${isMenuOpen ? "fa-x" : "fa-bars"}`}></i>
          </button>
          <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </>
      )}
    </nav>
  );
}
