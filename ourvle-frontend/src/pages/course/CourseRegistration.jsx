import React, { useState } from "react";
import axios from "axios";
import { Card, Form, Button, Alert } from "react-bootstrap";

const CourseRegistration = () => {
  const [courseID, setCourseID] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/register_student",
        { CourseID: courseID },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("✅ Enrolled successfully!");
      setError("");
      setCourseID("");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setSuccess("");
    }
  };

  return (
    <div className="container mt-5 col-md-6">
      <Card className="shadow border-0">
        <Card.Header className="bg-success text-white">
          <h4 className="mb-0">📚 Register for a Course</h4>
        </Card.Header>
        <Card.Body className="bg-light">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleRegister}>
            <Form.Group controlId="formCourseID" className="mb-3">
              <Form.Label><strong>Course ID</strong></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Course ID (e.g., COMP3161)"
                value={courseID}
                onChange={(e) => setCourseID(e.target.value)}
                required
              />
            </Form.Group>
            <div className="text-end">
              <Button type="submit" variant="success">
                ✅ Register
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CourseRegistration;
