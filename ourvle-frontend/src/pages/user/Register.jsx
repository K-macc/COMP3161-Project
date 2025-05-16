import React, { useState } from "react";
import axios from "axios";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { FaUser, FaLock, FaUserTag, FaUserCircle } from "react-icons/fa";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/register", form);
      setSuccess("🎉 Registration successful!");
      setError("");
      setForm({ name: "", username: "", password: "", role: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setSuccess("");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card className="shadow-lg border-0 rounded-4 p-3" style={{ width: "100%", maxWidth: "500px" }}>
        <Card.Header className="bg-primary text-white text-center">
          <h4 className="mb-0">📝 User Registration</h4>
        </Card.Header>
        <Card.Body className="bg-white rounded-bottom-4 px-4 py-4">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label><FaUserCircle className="me-2" />Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label><FaUser className="me-2" />Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="johndoe123"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label><FaLock className="me-2" />Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formRole">
              <Form.Label><FaUserTag className="me-2" />Select Role</Form.Label>
              <Form.Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              >
                <option value="">-- Choose Role --</option>
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 rounded-pill">
              🚀 Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
