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
      alert("Failed to fetch items");
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
      alert("Failed to fetch item details");
    }
  };

  const handleDelete = async () => {
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
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item");
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItemId(itemId);
    fetchSelectedItemDetails(itemId); // Fetch details of selected item
  };

  const handleAdminLogin = () => {
    if (adminPasscode === "adminaccess123") {
      setIsAdmin(true);
    } else {
      alert("Incorrect admin passcode");
    }
  };

  return (
    <div className="page-container">
      <h1>Delete an Item</h1>
      {!isAdmin && (
        <div className="admin-login">
          <input
            type="password"
            placeholder="Admin Passcode"
            value={adminPasscode}
            onChange={(e) => setAdminPasscode(e.target.value)}
          />
          <button onClick={handleAdminLogin}>Login</button>
        </div>
      )}
      {isAdmin && (
        <div className="items-list2">
          <div className="admin-controls">
            <select
              onChange={(e) => handleSelectItem(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select item to delete
              </option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title}
                </option>
              ))}
            </select>
            <br />
            {selectedItemDetails && (
              <div className="selected-item-details">
                <br />
                <img
                  src={selectedItemDetails.image}
                  alt={selectedItemDetails.title}
                  className="item-image"
                />
                <h2>{selectedItemDetails.title}</h2>
                <p>{selectedItemDetails.description}</p>
                <p>Base Bid: ${selectedItemDetails.startingBid}</p>
                <p>Current Bid: ${selectedItemDetails.currentBid}</p>
                <button onClick={handleDelete} className="delete-button">
                  Delete Item
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemDelete;
