import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
      </div>
    </Router>
  );
};

export default App;
