import React, { useState } from "react";
import "../../styles/Auth.css";
import "../../styles/Shared.css";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    let inputObj = { email, password };
    console.log(inputObj);
    let url = `${process.env.REACT_APP_BACKEND_URL}/auth/login`;

    try {
      const res = await axios.post(url, inputObj);
      if (res.status === 200) {
        alert("Login Successful");
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "/";
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login Failed");
    }
  };

  return (
    <div className="page-container">
      <div className="auth-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="auth-form">
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
          <input type="submit" value="Login" className="auth-button" />
        </form>
      </div>
    </div>
  );
}

export default Login;
