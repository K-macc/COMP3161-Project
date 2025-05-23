import React, { useState } from "react";
import axios from "axios";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { FaUser, FaLock, FaUserTag, FaUserCircle, FaUserPlus, FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("role", role);

    try {
      const response = await axios.post("/api/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data;
      if (response.status !== 201) {
        setMessageType("danger");
      } else {
        setMessageType("success");
        setName("");
        setUsername("");
        setPassword("");
        setRole("");
        setTimeout(() => {
          navigate("/");
        }, 5000);
      }
      setMessage(data.message);
    } catch (err) {
      setMessageType("danger");
      setMessage("Registration failed!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light user-container">
      <Card
        className="shadow-lg mx-auto mt-5 border-0"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <Card.Header className="bg-success text-white d-flex justify-content-center align-items-center">
          <h4 className="d-flex align-items-center mb-0"><FaUserPlus className="me-2"/> User Registration</h4>
        </Card.Header>
        <Card.Body className="bg-white rounded-bottom-4 px-4 py-4">
          {message && (
            <Alert
              variant={messageType === "success" ? "success" : "danger"}
              className="fade-alert position-absolute top-0 end-0 m-3"
            >
              {message}
            </Alert>
          )}
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>
                <FaUserCircle className="me-2" />
                Full Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>
                <FaUser className="me-2" />
                Username
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="johndoe123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>
                <FaLock className="me-2" />
                Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formRole">
              <Form.Label>
                <FaUserTag className="me-2" />
                Select Role
              </Form.Label>
              <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                autoComplete="off"
              >
                <option value="">-- Choose Role --</option>
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="btn-set"
            >
              <FaUserEdit/> Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
