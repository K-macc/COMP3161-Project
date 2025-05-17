import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import useAuthFetch from "@/context/AuthFetch";
import { FaClipboardList,FaPenNib } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CourseRegistration = () => {
  const [courseID, setCourseID] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    try {
      const response = await authFetch("/api/register_student", {
        body: JSON.stringify({ CourseID: courseID }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.status !== 201) {
        setMessageType("danger");
      } else {
        setMessageType("success");
        setCourseID("");
        setTimeout(() => {
          navigate("/my-courses");
        }, 5000);
      }
      setMessage(data.message);
    } catch (err) {
      setMessageType("danger");
      setMessage("Registration failed!");
    }
  };

  return (
    <div className="container mt-5 col-md-6">
      <Card className="shadow border-0">
        <Card.Header className="bg-success text-white">
          <h4 className="mb-0"><FaClipboardList/> Register for a Course</h4>
        </Card.Header>
        <Card.Body className="bg-light">
          {message && (
            <Alert
              variant={messageType === "success" ? "success" : "danger"}
              className="fade-alert position-absolute top-0 end-0 m-3"
            >
              {message}
            </Alert>
          )}
          <Form onSubmit={handleRegister}>
            <Form.Group controlId="formCourseID" className="mb-3">
              <Form.Label>
                <strong>CourseID</strong>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Course ID (e.g., COMP3161)"
                value={courseID}
                onChange={(e) => setCourseID(e.target.value)}
              />
            </Form.Group>
            <div className="text-end">
              <Button type="submit" variant="primary">
                <FaPenNib/> Register
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CourseRegistration;
