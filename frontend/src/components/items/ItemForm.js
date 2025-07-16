import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/ItemForm.css";
import "../../styles/Shared.css";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const ItemForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [auctionEndTime, setAuctionEndTime] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!startingBid || startingBid <= 0) newErrors.startingBid = "Starting bid must be greater than 0";
    if (!auctionEndTime) newErrors.auctionEndTime = "Auction end time is required";
    
    const endTime = new Date(auctionEndTime);
    if (endTime <= new Date()) newErrors.auctionEndTime = "Auction end time must be in the future";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    const newItem = {
      title: title.trim(),
      description: description.trim(),
      startingBid: parseFloat(startingBid),
      auctionEndTime: new Date(auctionEndTime).toISOString(),
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BASE_URL}/items/createItem`, newItem, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Item created successfully:", res.data);
      navigate("/items");
    } catch (err) {
      console.error("Error creating item:", err);
      setErrors({ submit: "Failed to create item. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="item-form-container">
      <div className="item-form-card">
        <h2>Add New Item</h2>
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        
        <form onSubmit={handleSubmit} className="item-form">
          <div className="form-group">
            <label htmlFor="title">Item Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "error" : ""}
              placeholder="Enter item title"
              disabled={isLoading}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={errors.description ? "error" : ""}
              placeholder="Describe your item..."
              rows="4"
              disabled={isLoading}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startingBid">Starting Bid ($) *</label>
              <input
                id="startingBid"
                type="number"
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                className={errors.startingBid ? "error" : ""}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                disabled={isLoading}
              />
              {errors.startingBid && <span className="error-text">{errors.startingBid}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="auctionEndTime">Auction End Time *</label>
              <input
                id="auctionEndTime"
                type="datetime-local"
                value={auctionEndTime}
                onChange={(e) => setAuctionEndTime(e.target.value)}
                className={errors.auctionEndTime ? "error" : ""}
                disabled={isLoading}
              />
              {errors.auctionEndTime && <span className="error-text">{errors.auctionEndTime}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => navigate("/items")}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
