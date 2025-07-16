import React, { useEffect, useState } from "react";
import "../../styles/ItemList.css";
import "../../styles/Shared.css";
import axios from "axios";
import { Link } from "react-router-dom";

function ItemsList() {
  const [items, setItems] = useState([]);

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
    const fetchItems = async () => {
      try {
        console.log("Fetching items...");
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/items/itemget`);
        console.log("Response received:", res);
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

    fetchItems();
  }, []);

  return (
    <div className="page-container">
      <h1>Auction Items</h1>
      <div className="items-grid">
        {items.map((item) => {
          const isAuctionEnded = new Date(item.auctionEndTime) < new Date();
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
                      <div className="sold-out-badge">Auction Ended</div>
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
