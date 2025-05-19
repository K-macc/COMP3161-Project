import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { FaBook, FaPlusCircle } from "react-icons/fa";
import useAuthFetch from "@/context/AuthFetch";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const [course, setCourse] = useState({ CourseID: "", CourseName: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    try {
      const response = await authFetch("/api/create_course", {
        method: "POST",
        body: JSON.stringify(course),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.status !== 201) {
        setMessageType("danger");
      } else {
        setMessageType("success");
        setCourse({ CourseID: "", CourseName: "" });
        setTimeout(() => {
          navigate("/courses-list");
        }, 5000);
      }
      setMessage(data.message);
    } catch (err) {
      setMessageType("danger");
      setMessage("Error creating course!");
    }
  };

  return (
    <div className="container mt-4">
      <Card
        className="shadow-lg mx-auto mt-5 border-0"
        style={{ width: "100%", maxWidth: "600px" }}
      >
        {message && (
          <Alert
            variant={messageType === "success" ? "success" : "danger"}
            className="fade-alert position-absolute top-0 end-0 m-3"
          >
            {message}
          </Alert>
        )}
        <Card.Header className="bg-success text-white d-flex justify-content-center align-items-center">
        <h4 className="d-flex align-items-center mb-0">
          <FaPlusCircle className="me-2 text-white" />
          Create New Course
        </h4>
        </Card.Header>
        <Form onSubmit={handleCreate} className="p-4">
          <Form.Group className="mb-3" controlId="courseId">
            <Form.Label><strong>CourseID</strong></Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. COMP3161"
              value={course.CourseID}
              onChange={(e) =>
                setCourse({ ...course, CourseID: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="courseName">
            <Form.Label><strong>Course Name</strong></Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Data Structures"
              value={course.CourseName}
              onChange={(e) =>
                setCourse({ ...course, CourseName: e.target.value })
              }
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="btn-set">
            <FaBook className="me-1" />
            Create Course
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default CreateCourse;
