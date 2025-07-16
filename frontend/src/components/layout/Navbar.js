import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const navigate = useNavigate();

  // Listen for storage changes to update navbar state
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
    };

    // Listen for storage events (cross-tab changes)
    window.addEventListener("storage", handleStorageChange);
    
    // Listen for custom logout event
    window.addEventListener("userLogout", handleLogoutEvent);

    // Also check periodically for same-tab changes
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLogout", handleLogoutEvent);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    
    // Also clear admin session if it exists
    localStorage.removeItem("adminSession");
    localStorage.removeItem("adminSessionExpiry");
    
    setIsLoggedIn(false);
    
    // Dispatch custom logout event
    window.dispatchEvent(new CustomEvent("userLogout"));
    
    navigate("/");
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <h1>
          <Link to="/">Bid Avenue</Link>
        </h1>
        <ul>
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/items">Items</Link>
              </li>
              <li>
                <Link to="/items/create">Add Item</Link>
              </li>
              <li>
                <Link to="/items/delete">Delete Item</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
