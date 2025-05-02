import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form data:", form);
      await axios.post("/api/register", form);
      alert("Registration successful");
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };
  

  return (
    <div className="container mt-5 col-md-6">
      <h3 className="mb-4">Register</h3>
      <form onSubmit={handleSubmit}>
        {["name", "username", "password"].map((field) => (
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
        <div className="mb-3">
          <select
            className="form-select"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="">--Select--</option>
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
};

export default Register;
