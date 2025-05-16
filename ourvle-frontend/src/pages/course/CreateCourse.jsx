import React, { useState } from "react";
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
      const response = await authFetch("/api/create_course", {
        method: "POST",
        body: JSON.stringify(course),
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      if (response.status !== 201){
        setMessageType("danger");
      } else {
        setMessageType("success");
        setCourse({ CourseID: "", CourseName: "" });
      }
      setMessage(data.message);
      
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    } catch (err) {
      setMessageType("danger");
      setMessage("Error creating course!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Card
        className="p-4 shadow-lg"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        {message && (
          <Alert
            variant={messageType === "success" ? "success" : "error"}
            className="fade-alert position-absolute top-0 end-0 m-3"
          >
            {message}
          </Alert>
        )}

        <h4 className="text-center mb-4">
          <FaPlusCircle className="me-2 text-primary" />
          Create New Course
        </h4>

        <Form onSubmit={handleCreate}>
          <Form.Group className="mb-3" controlId="courseId">
            <Form.Label>Course ID</Form.Label>
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
            <Form.Label>Course Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Data Structures"
              value={course.CourseName}
              onChange={(e) =>
                setCourse({ ...course, CourseName: e.target.value })
              }
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
