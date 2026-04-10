import React from "react";
import { Link } from "react-router-dom";
import { ReactTyped } from "react-typed";

import "./DealBanner.css";

export default function DealBanner() {
  return (
    <div className="deal-banner">
      <div className="deal-content">
        <h2 className="deal-subtitle">Today’s Deal</h2>

        <h1 className="deal-title">Big Sale</h1>

        <p className="deal-typing">
          <ReactTyped
            strings={[
              "Limited Time Only",
              "Don’t Miss Out",
              "Shop Before It’s Gone",
              "Hurry Up!",
            ]}
            typeSpeed={80}
            backSpeed={40}
            loop
          />
        </p>

        <Link to="/Redirect" className="deal-btn">
          Explore Now
        </Link>
      </div>
    </div>
  );
}
