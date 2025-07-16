import React, { useState } from "react";
import "../../styles/Auth.css";
import "../../styles/Shared.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    let inputObj = { username, email, password };
    let url = `${process.env.REACT_APP_BACKEND_URL}/auth/createuser`;

    try {
      const res = await axios.post(url, inputObj);
      if (res.status === 200) {
        toast.success("User Created Successfully!");
        navigate("/login");
      } else {
        toast.error("Failed to create user");
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="page-container">
      <div className="auth-card">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <input type="submit" value="Sign Up" className="auth-button" />
        </form>
      </div>
    </div>
  );
}

export default Register;
