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
    const handleBeforeUnload = () => {
      // Clear login session when browser/tab is closed
      localStorage.setItem("isLoggedIn", "false");
      
      // Also clear admin session if it exists
      localStorage.removeItem("adminSession");
      localStorage.removeItem("adminSessionExpiry");
    };

    // Add event listener for beforeunload (browser/tab close)
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
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
