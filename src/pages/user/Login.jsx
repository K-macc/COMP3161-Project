import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { FaUser, FaLock, FaUserCircle, FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const [user_id, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();
  const { syncAuth } = useContext(AuthContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect");

  useEffect(() => {
    const loginSuccess = localStorage.getItem("loginSuccess");
    if (!loginSuccess) {
      setUserID("USER-");
    }
  }, []);

  const handleUserIDChange = (e) => {
    const input = e.target.value;
    if (input.startsWith("USER-")) {
      setUserID(input);
    } else {
      setUserID("USER-");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("password", password);

    try {
      const response = await axios.post("/api/login", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
      if (response.status !== 200) {
        setMessageType("danger");
      } else {
        setMessageType("success");
        setUserID(""); 
        setPassword("");

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("loginSuccess", "true"); 
        syncAuth();

        setTimeout(() => {
          navigate(redirect || "/dashboard");
        }, 4000);
      }
      setMessage(data.message);
    } catch (err) {
      setMessageType("danger");
      setMessage("Login failed!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light user-container">
      <Card
        className="shadow-lg mx-auto mt-5 border-0"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <Card.Header className="bg-success text-white d-flex justify-content-center align-items-center">
          <h4 className="d-flex align-items-center mb-0">
            <FaUserCircle className="me-2" /> 
            Login
          </h4>
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

          <h5 className="text-center text-muted mb-4">
            {redirect
              ? "Session expired. Please login to continue."
              : "Please login to your account."}
          </h5>

          <Form onSubmit={handleLogin} autoComplete="off">
            <Form.Group className="mb-3" controlId="formUserID">
              <Form.Label>
                <FaUser className="me-2" />
                User ID
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="UserID"
                value={user_id}
                onChange={handleUserIDChange}
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
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

            <Button type="submit" variant="primary" className="btn-set">
              <FaSignInAlt/> Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
