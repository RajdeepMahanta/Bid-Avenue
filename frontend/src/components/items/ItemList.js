import React, { useEffect, useState } from "react";
import "../../styles/ItemList.css";
import "../../styles/Shared.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

function ItemsList() {
  const [items, setItems] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState({});

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

  const checkAuctionStatus = (auctionEndTime) => {
    const now = new Date();
    const endTime = new Date(auctionEndTime);
    return endTime <= now;
  };

  const calculateTimeRemaining = (auctionEndTime) => {
    const now = new Date();
    const endTime = new Date(auctionEndTime);
    const difference = endTime - now;

    if (difference <= 0) {
      return "Auction Ended";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("Fetching items...");
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/items/itemget`);
        console.log("Response received:", res);
        console.log("Items data:", res.data);
        console.log("First item structure:", res.data[0]);
        if (res.status === 200) {
          setItems(res.data);
        } else {
          throw new Error("Failed to fetch items");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch items");
      }
    };

    fetchItems();
  }, []);

  // Timer effect to update time remaining for all items
  useEffect(() => {
    if (items.length === 0) return;

    const timer = setInterval(() => {
      const newTimeRemaining = {};
      items.forEach(item => {
        newTimeRemaining[item._id] = calculateTimeRemaining(item.auctionEndTime);
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [items]);

  return (
    <div className="page-container">
      <h1>Auction Items</h1>
      <div className="items-grid">
        {items.map((item) => {
          const isAuctionEnded = checkAuctionStatus(item.auctionEndTime);
          const itemTimeRemaining = timeRemaining[item._id] || calculateTimeRemaining(item.auctionEndTime);
          
          return (
            <div key={item._id} className="item-card">
              <div className="item-image-container">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="item-image"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x200/cccccc/666666?text=No+Image";
                  }}
                />
                {isAuctionEnded && <div className="sold-overlay">SOLD OUT</div>}
              </div>
              <div className="item-content">
                <h3 className="item-title">{item.title}</h3>
                <p className="item-description">{item.description}</p>
                <div className="item-pricing">
                  <p className="base-bid">Base Bid: <span>${item.startingBid}</span></p>
                  <p className="current-bid">Current Bid: <span>${item.currentBid}</span></p>
                </div>
                <div className="item-footer">
                  {!isAuctionEnded && (
                    <>
                      <p className="auction-time">
                        Ends: {formatDate(item.auctionEndTime)}
                      </p>
                      <p className="time-remaining">
                        {itemTimeRemaining}
                      </p>
                      <Link
                        to={`/bidding/${item._id}`}
                        className="place-bid-button"
                      >
                        Place Bid
                      </Link>
                    </>
                  )}
                  {isAuctionEnded && (
                    <>
                      <p className="auction-time ended">
                        Ended: {formatDate(item.auctionEndTime)}
                      </p>
                      <div className="sold-out-badge">
                        Auction Ended
                        {item.currentBidder && (
                          <div className="winner-info">
                            Winner: {item.currentBidder}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ItemsList;
