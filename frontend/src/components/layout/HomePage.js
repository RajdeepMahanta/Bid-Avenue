import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/HomePage.css";
import "../../styles/Shared.css";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
    };

    // Listen for storage events and custom logout event
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLogout", handleLogoutEvent);

    // Also check periodically for same-tab changes
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLogout", handleLogoutEvent);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="page-container">
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
