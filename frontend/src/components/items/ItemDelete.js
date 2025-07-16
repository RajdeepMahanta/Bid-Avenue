import React, { useEffect, useState } from "react";
import "../../styles/ItemDelete.css";
import "../../styles/Shared.css";
import axios from "axios";

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
  }, []);

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
    if (!window.confirm(`Are you sure you want to delete "${selectedItemDetails?.title}"? This action cannot be undone.`)) {
      return;
    }

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
        alert("Item deleted successfully");
        fetchItems(); // Refresh items list after deletion
        setSelectedItemDetails(null); // Clear selected item details after deletion
        setSelectedItemId("");
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItemId(itemId);
    fetchSelectedItemDetails(itemId); // Fetch details of selected item
  };

  const handleAdminLogin = () => {
    setError("");
    if (adminPasscode === "adminaccess123") {
      setIsAdmin(true);
    } else {
      setError("Incorrect admin passcode. Please try again.");
    }
  };

  return (
    <div className="page-container">
      <h1>Delete Item</h1>
      
      {!isAdmin && (
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
      )}

      {isAdmin && (
        <div className="delete-container">
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
                  onClick={handleDelete} 
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
        </div>
      )}
    </div>
  );
}

export default ItemDelete;
