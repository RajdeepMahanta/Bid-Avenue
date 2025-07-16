import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/HomePage.css";

const HomePage = () => {
  const [isLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  return (
    <div className="home-container">
      <h1>Welcome to Bid Avenue</h1>
      <p>Your one-stop destination for online auctions</p>
      <div className="home-buttons">
        {isLoggedIn ? (
          <Link to="/items" className="home-button">Browse Items</Link>
        ) : (
          <Link to="/login" className="home-button">Login / Register</Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;
