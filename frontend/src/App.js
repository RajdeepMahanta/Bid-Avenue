import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ItemList from "./components/items/ItemList";
import ItemForm from "./components/items/ItemForm";
import Navbar from "./components/layout/Navbar";
import BiddingPage from "./components/bids/BidForm";
import "./App.css";
import ItemDelete from "./components/items/ItemDelete";
import HomePage from "./components/layout/HomePage";

const App = () => {
  useEffect(() => {
    // Create a heartbeat mechanism
    let heartbeatInterval;
    
    const startHeartbeat = () => {
      // Update timestamp every 5 seconds while app is active
      heartbeatInterval = setInterval(() => {
        localStorage.setItem("lastActivity", Date.now().toString());
      }, 5000);
    };

    const checkForInactiveSession = () => {
      const lastActivity = localStorage.getItem("lastActivity");
      if (lastActivity) {
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
        // If more than 15 seconds without activity, consider browser closed
        if (timeSinceLastActivity > 15000) {
          localStorage.setItem("isLoggedIn", "false");
          localStorage.removeItem("adminSession");
          localStorage.removeItem("adminSessionExpiry");
          localStorage.removeItem("lastActivity");
        }
      }
    };

    // Check for inactive sessions when app starts
    checkForInactiveSession();
    
    // Start the heartbeat
    startHeartbeat();
    
    // Set initial activity timestamp
    localStorage.setItem("lastActivity", Date.now().toString());

    // Cleanup on unmount
    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/items" element={<ItemList />} />
            <Route path="/items/create" element={<ItemForm />} />
            <Route path="/items/delete" element={<ItemDelete />} />
            <Route path="/bidding/:itemId" element={<BiddingPage />} />
          </Routes>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
};

export default App;
