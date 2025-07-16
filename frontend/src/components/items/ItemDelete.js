import React, { useEffect, useState } from "react";
import "../../styles/ItemDelete.css";
import "../../styles/Shared.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function ItemDelete() {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    };
    return new Date(dateString).toLocaleString("en-IN", options);
  };

  useEffect(() => {
    fetchItems();
    checkAdminSession();
    
    // Listen for logout events to update local state
    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
      setIsAdmin(false);
    };
    
    window.addEventListener("userLogout", handleLogoutEvent);
    
    return () => {
      window.removeEventListener("userLogout", handleLogoutEvent);
    };
  }, []);

  // Timer to check session expiry and update remaining time
  useEffect(() => {
    if (!isAdmin) return;

    const timer = setInterval(() => {
      // Check if main login is still valid
      const mainLoginStatus = localStorage.getItem("isLoggedIn") === "true";
      if (!mainLoginStatus) {
        handleAdminLogout();
        return;
      }

      const sessionExpiry = localStorage.getItem("adminSessionExpiry");
      if (sessionExpiry) {
        const now = new Date().getTime();
        const expiry = parseInt(sessionExpiry);
        const timeLeft = expiry - now;

        if (timeLeft <= 0) {
          handleAdminLogout();
          toast.warning("Admin session expired. Please login again.");
        } else {
          const minutes = Math.floor(timeLeft / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          setSessionTimeRemaining(`${minutes}m ${seconds}s`);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isAdmin]);

  const checkAdminSession = () => {
    // First check if user is logged into the main website
    const mainLoginStatus = localStorage.getItem("isLoggedIn") === "true";
    if (!mainLoginStatus) {
      setIsAdmin(false);
      localStorage.removeItem("adminSession");
      localStorage.removeItem("adminSessionExpiry");
      return;
    }

    const adminSession = localStorage.getItem("adminSession");
    const sessionExpiry = localStorage.getItem("adminSessionExpiry");
    
    if (adminSession === "authenticated" && sessionExpiry) {
      const now = new Date().getTime();
      const expiry = parseInt(sessionExpiry);
      
      if (now < expiry) {
        setIsAdmin(true);
      } else {
        // Session expired, clear it
        localStorage.removeItem("adminSession");
        localStorage.removeItem("adminSessionExpiry");
        setIsAdmin(false);
      }
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/items/itemget`);
      if (res.status === 200) {
        setItems(res.data);
      } else {
        throw new Error("Failed to fetch items");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch items. Please try again.");
    }
  };

  const fetchSelectedItemDetails = async (itemId) => {
    try {
      const res = await axios.get(`${BASE_URL}/items/${itemId}`);
      if (res.status === 200) {
        setSelectedItemDetails(res.data);
      } else {
        throw new Error("Failed to fetch item details");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch item details. Please try again.");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const res = await axios.delete(
        `${BASE_URL}/items/${selectedItemId}`,
          {
            headers: {
            Authorization: `Bearer ${adminPasscode}`,
            },
          }
      );

      if (res.status === 200) {
        toast.success("Item deleted successfully!");
        fetchItems(); // Refresh items list after deletion
        setSelectedItemDetails(null); // Clear selected item details after deletion
        setSelectedItemId("");
        setShowDeleteConfirmation(false); // Close confirmation modal
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Failed to delete item. Please try again.");
      setError("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleSelectItem = (itemId) => {
    setSelectedItemId(itemId);
    fetchSelectedItemDetails(itemId); // Fetch details of selected item
  };

  const handleAdminLogin = () => {
    setError("");
    
    // Check if user is logged into main website first
    if (!isLoggedIn) {
      setError("Please login to the website first to access admin features.");
      return;
    }
    
    if (adminPasscode === "adminaccess123") {
      setIsAdmin(true);
      
      // Set session with 2 hour expiration
      const expiryTime = new Date().getTime() + (2 * 60 * 60 * 1000); // 2 hours
      localStorage.setItem("adminSession", "authenticated");
      localStorage.setItem("adminSessionExpiry", expiryTime.toString());
      
      // Clear the password input for security
      setAdminPasscode("");
      
      toast.success("Admin access granted!");
    } else {
      setError("Incorrect admin passcode. Please try again.");
    }
  };

  const handleAdminLogout = () => {
    // Clear admin session
    localStorage.removeItem("adminSession");
    localStorage.removeItem("adminSessionExpiry");
    
    // Clear main user session
    localStorage.setItem("isLoggedIn", "false");
    
    // Dispatch custom logout event to update navbar
    window.dispatchEvent(new CustomEvent("userLogout"));
    
    toast.success("Logged out successfully!");
    
    // Navigate to home page
    navigate("/");
  };

  return (
    <div className="page-container">
      <h1>Delete Item</h1>
      
      {!isLoggedIn ? (
        <div className="admin-login-container">
          <div className="admin-login-card">
            <h3>Login Required</h3>
            <p>You must be logged in to access the item deletion feature.</p>
            <div className="form-actions">
              <button 
                onClick={() => navigate("/login")}
                className="btn-submit"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      ) : !isAdmin ? (
        <div className="admin-login-container">
          <div className="admin-login-card">
            <h3>Admin Access Required</h3>
            <p>Please enter the admin passcode to access item deletion.</p>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="adminPasscode">Admin Passcode</label>
              <input
                type="password"
                id="adminPasscode"
                placeholder="Enter admin passcode"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            
            <button 
              onClick={handleAdminLogin}
              className="btn-submit"
              disabled={!adminPasscode.trim()}
            >
              Login as Admin
            </button>
          </div>
        </div>
      ) : (
        <div className="delete-container">
          <div className="admin-header">
            <div className="admin-status">
              <div className="admin-info">
                <span className="admin-indicator">🛡️ Admin Access</span>
                {sessionTimeRemaining && (
                  <span className="session-timer">Session: {sessionTimeRemaining}</span>
                )}
              </div>
              <button 
                onClick={handleAdminLogout}
                className="btn-logout"
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="item-selector-card">
            <h3>Select Item to Delete</h3>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="itemSelect">Choose an item:</label>
              <select
                id="itemSelect"
                onChange={(e) => handleSelectItem(e.target.value)}
                value={selectedItemId}
                className="item-select"
              >
                <option value="" disabled>
                  Select item to delete
                </option>
                {items.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title} - ${item.currentBid}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedItemDetails && (
            <div className="selected-item-card">
              <div className="item-image-container">
                <img
                  src={selectedItemDetails.image}
                  alt={selectedItemDetails.title}
                  className="item-image"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x200/cccccc/666666?text=No+Image";
                  }}
                />
              </div>
              
              <div className="item-content">
                <h2 className="item-title">{selectedItemDetails.title}</h2>
                <p className="item-description">{selectedItemDetails.description}</p>
                
                <div className="item-pricing">
                  <p className="base-bid">Base Bid: <span>${selectedItemDetails.startingBid}</span></p>
                  <p className="current-bid">Current Bid: <span>${selectedItemDetails.currentBid}</span></p>
                </div>
                
                <div className="item-footer">
                  <p className="auction-time">
                    Ends: {formatDate(selectedItemDetails.auctionEndTime)}
                  </p>
                </div>
              </div>

              <div className="delete-actions">
                <button 
                  onClick={handleDeleteClick} 
                  className="btn-delete"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Item"}
                </button>
                <button 
                  onClick={() => {
                    setSelectedItemDetails(null);
                    setSelectedItemId("");
                  }}
                  className="btn-cancel"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirmation && selectedItemDetails && (
            <div className="modal-overlay">
              <div className="confirmation-modal">
                <div className="modal-header">
                  <h3>⚠️ Confirm Deletion</h3>
                </div>
                <div className="modal-content">
                  <p>Are you sure you want to delete this item?</p>
                  <div className="item-preview">
                    <strong>"{selectedItemDetails.title}"</strong>
                    <span>Current Bid: ${selectedItemDetails.currentBid}</span>
                  </div>
                  <p className="warning-text">
                    <strong>This action cannot be undone.</strong>
                  </p>
                </div>
                <div className="modal-actions">
                  <button 
                    onClick={handleDelete}
                    className="btn-confirm-delete"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete Item"}
                  </button>
                  <button 
                    onClick={handleCancelDelete}
                    className="btn-cancel-modal"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ItemDelete;
