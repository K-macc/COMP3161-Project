import React, { useState } from "react";
import axios from "axios";

const CreateCourse = () => {
  const [course, setCourse] = useState({ CourseID: "", CourseName: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/create_course", course, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Show success message
      setMessage("Course created successfully!");
      setMessageType("success");

      // Reset form
      setCourse({ CourseID: "", CourseName: "" });

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      // Show error message
      setMessage(err.response?.data?.message || "Error creating course.");
      setMessageType("error");
    }
  };

  return (
    <div className="container mt-5 col-md-6">
      <h3>Create New Course</h3>
      
      {/* Flash Message */}
      {message && (
        <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleCreate}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Course ID"
          value={course.CourseID}
          onChange={(e) => setCourse({ ...course, CourseID: e.target.value })}
          required
        />
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Course Name"
          value={course.CourseName}
          onChange={(e) => setCourse({ ...course, CourseName: e.target.value })}
          required
        />
        <button className="btn btn-primary w-100">Create Course</button>
      </form>
    </div>
  );
};

export default CreateCourse;
