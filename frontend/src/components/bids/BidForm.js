import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/BiddingPage.css";
import "../../styles/Shared.css";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function BiddingPage() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [currentBidder, setCurrentBidder] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    const fetchItem = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/items/${itemId}`);
        if (res.status === 200) {
          setItem(res.data);
          setCurrentBidder(res.data.currentBidder || "");
        } else {
          throw new Error("Failed to fetch item details");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch item details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleBidSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (parseFloat(bidAmount) <= parseFloat(item.currentBid)) {
      setError("Bid amount must be higher than the current bid.");
      return;
    }

    if (!currentBidder.trim()) {
      setError("Please enter your name.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.put(`${BASE_URL}/items/${itemId}/bid`, {
        bidder: currentBidder.trim(),
        amount: bidAmount,
      });

      if (res.status === 200) {
        alert(`Bid of $${bidAmount} placed successfully!`);
        navigate("/items");
      } else {
        throw new Error("Failed to place bid");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to place bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!item || error) {
    return (
      <div className="page-container">
        <h1>Error</h1>
        <p>{error || "Item not found"}</p>
        <button 
          className="home-button" 
          onClick={() => navigate("/items")}
        >
          Back to Items
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Place Your Bid</h1>
      <div className="bidding-container">
        <div className="bidding-card">
          <div className="item-image-container">
            <img 
              src={item.image} 
              alt={item.title} 
              className="item-image"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x200/cccccc/666666?text=No+Image";
              }}
            />
          </div>
          
          <div className="item-content">
            <h2 className="item-title">{item.title}</h2>
            <p className="item-description">{item.description}</p>
            
            <div className="item-pricing">
              <p className="base-bid">Base Bid: <span>${item.startingBid}</span></p>
              <p className="current-bid">Current Bid: <span>${item.currentBid}</span></p>
            </div>
            
            <div className="item-footer">
              <p className="auction-time">
                Ends: {formatDate(item.auctionEndTime)}
              </p>
            </div>
          </div>
        </div>

        <div className="bid-form-card">
          <h3>Place Your Bid</h3>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleBidSubmit} className="bid-form">
            <div className="form-group">
              <label htmlFor="bidAmount">Bid Amount ($)</label>
              <input
                type="number"
                id="bidAmount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Minimum: $${parseFloat(item.currentBid) + 1}`}
                min={parseFloat(item.currentBid) + 1}
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="currentBidder">Your Name</label>
              <input
                type="text"
                id="currentBidder"
                value={currentBidder}
                onChange={(e) => setCurrentBidder(e.target.value)}
                placeholder="Enter your full name"
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => navigate("/items")}
                disabled={isSubmitting}
              >
                Back to Items
              </button>
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? "Placing Bid..." : "Place Bid"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BiddingPage;
