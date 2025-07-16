import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "../../styles/Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [forceUpdate, setForceUpdate] = useState(0);
  const navigate = useNavigate();

  // Listen for storage changes to update navbar state
  useEffect(() => {
    const handleStorageChange = () => {
      const currentLoginStatus = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(currentLoginStatus);
      // Force component re-render
      setForceUpdate(prev => prev + 1);
    };

    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
      setForceUpdate(prev => prev + 1);
    };

    // Listen for storage events (cross-tab changes)
    window.addEventListener("storage", handleStorageChange);
    
    // Listen for custom logout event
    window.addEventListener("userLogout", handleLogoutEvent);

    // Check more frequently for same-tab changes (every 500ms instead of 1000ms)
    const interval = setInterval(handleStorageChange, 500);

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
    
    // Immediately update the state
    setIsLoggedIn(false);
    
    // Dispatch custom logout event
    window.dispatchEvent(new CustomEvent("userLogout"));
    
    toast.success("Logged out successfully!");
    
    // Force a small delay to ensure state is updated before navigation
    setTimeout(() => {
      navigate("/");
    }, 100);
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
                <button onClick={() => navigate("/login")} className="login-button">
                  Login
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/register")} className="logout-button">
                  Register
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
