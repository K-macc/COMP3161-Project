import React, { useState } from "react";
import axios from "axios";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { FaBook, FaPlusCircle } from "react-icons/fa";
import useAuthFetch from "@/context/AuthFetch";

const CreateCourse = () => {
  const [course, setCourse] = useState({ CourseID: "", CourseName: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 
  const authFetch = useAuthFetch();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await authFetch("/api/create_course", course, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Course created successfully!");
      setMessageType("success");
      setCourse({ CourseID: "", CourseName: "" });

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating course.");
      setMessageType("error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "500px" }}>
        <h4 className="text-center mb-4">
          <FaPlusCircle className="me-2 text-primary" />
          Create New Course
        </h4>

        {message && (
          <Alert variant={messageType === "success" ? "success" : "danger"}>
            {message}
          </Alert>
        )}

        <Form onSubmit={handleCreate}>
          <Form.Group className="mb-3" controlId="courseId">
            <Form.Label>Course ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. COMP3161"
              value={course.CourseID}
              onChange={(e) => setCourse({ ...course, CourseID: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="courseName">
            <Form.Label>Course Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Data Structures"
              value={course.CourseName}
              onChange={(e) => setCourse({ ...course, CourseName: e.target.value })}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            <FaBook className="me-2" />
            Create Course
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default CreateCourse;
