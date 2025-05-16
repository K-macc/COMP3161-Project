import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [form, setForm] = useState({ user_id: "", password: "" });
  const navigate = useNavigate();
  const { syncAuth } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");
    try {
      const res = await axios.post("/api/login", form);
      localStorage.setItem("token", res.data.access_token);
      syncAuth();
      navigate(redirect || "/dashboard");
    } catch (err) {
      alert(
        "Login failed: " + (err.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg border-0 rounded-4 login-container">
        <h3 className="mb-3 text-center text-primary">Welcome Back!</h3>
        <p className="text-muted text-center mb-4">Please login to your account</p>
        <form onSubmit={handleLogin}>
          <div className="mb-3 input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaUser />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="User ID"
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: e.target.value })}
              required
            />
          </div>
          <div className="mb-4 input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaLock />
            </span>
            <input
              type="password"
              className="form-control border-start-0"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button className="btn btn-primary w-100 rounded-pill">🔐 Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
