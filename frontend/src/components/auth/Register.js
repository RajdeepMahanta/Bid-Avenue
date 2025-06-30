import React, { useState } from "react";
import "../../styles/Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    let inputObj = { username, email, password };
    let url = `${process.env.REACT_APP_BACKEND_URL}/auth/login`;

    try {
      const res = await axios.post(url, inputObj);
      if (res.status === 200) {
        setAlert({ message: "User Created Successfully" });
        navigate("/login");
      } else {
        setAlert({ message: "Failed to create user" });
      }
    } catch (err) {
      console.log(err);
      setAlert({ message: "An error occurred" });
    }
  };

  return (
    <div className="register-container">
      <h1>Sign Up</h1>
      {alert.message && (
        <div className={`alert alert-${alert.type}`}>{alert.message}</div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input type="submit" value="Sign Up" />
      </form>
    </div>
  );
}

export default Register;
