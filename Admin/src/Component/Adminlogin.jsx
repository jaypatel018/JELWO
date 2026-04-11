import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Adminlogin.css";

const Adminlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/login`,
        { email, password }
      );

      if (res.data.msg === "Login success") {
        alert("Admin Login Successful");
        navigate("/admin");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        alert("Server error");
      }
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <h4 className="login-title">Jelwo Admin</h4>
        <p className="login-subtitle">Sign in to manage your store</p>

        <form onSubmit={submit}>
          <div className="admin-field">
            <i className="fa-solid fa-envelope"></i>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-field">
            <i className="fa-solid fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Adminlogin;
