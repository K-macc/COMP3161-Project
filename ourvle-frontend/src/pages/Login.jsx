import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ user_id: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/login", form);
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      alert(
        "Login failed: " + (err.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg login-container">
        <h3 className="mb-4">Login</h3>
        <form onSubmit={handleLogin}>
          {["user_id", "password"].map((field) => (
            <div className="mb-3" key={field}>
              <input
                type={field === "password" ? "password" : "text"}
                className="form-control"
                placeholder={field}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
              />
            </div>
          ))}
          <button className="btn btn-success w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
