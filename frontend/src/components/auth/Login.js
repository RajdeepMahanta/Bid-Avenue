import React, { useState } from "react";
import "../../styles/Login.css";
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
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <input type="submit" value="Login" className="login-button" />
      </form>
    </div>
  );
}

export default Login;
