import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
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
