import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/BiddingPage.css";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function BiddingPage() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [currentBidder, setCurrentBidder] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        alert("Failed to fetch item details");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleBidSubmit = async (event) => {
    event.preventDefault();

    if (parseFloat(bidAmount) <= parseFloat(item.currentBid)) {
      alert("Bid amount must be higher than the current bid.");
      return;
    }

    try {
      const res = await axios.put(`${BASE_URL}/items/${itemId}/bid`, {
        bidder: currentBidder,
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
      alert("Failed to place bid");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>Error: Item not found</div>;
  }

  return (
    <div>
      <div className="bidding-page">
        <div className="item-details">
          <h1>{item.title}</h1>
          <img src={item.image} alt={item.title} className="item-image2" />
          <p>{item.description}</p>
          <p>Base Bid: ${item.startingBid}</p>
          <p>Current Bid: ${item.currentBid}</p>
        </div>
        <form onSubmit={handleBidSubmit} className="bid-form">
          <label htmlFor="bidAmount">Enter your bid:</label>
          <input
            type="number"
            id="bidAmount"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
          />
          <label htmlFor="currentBidder">Your Name:</label>
          <input
            type="text"
            id="currentBidder"
            value={currentBidder}
            onChange={(e) => setCurrentBidder(e.target.value)}
            required
          />
          <button type="submit">Place Bid</button>
        </form>
      </div>
    </div>
  );
}

export default BiddingPage;
