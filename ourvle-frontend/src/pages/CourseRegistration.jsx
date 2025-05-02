import React, { useState } from "react";
import axios from "axios";

const CourseRegistration = () => {
  const [courseID, setCourseID] = useState("");

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
      alert("Enrolled successfully!");
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  return (
    <div className="container mt-5 col-md-6">
      <h3>Register for a Course</h3>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Course ID"
          value={courseID}
          onChange={(e) => setCourseID(e.target.value)}
          required
        />
        <button className="btn btn-success w-100">Register</button>
      </form>
    </div>
  );
};

export default CourseRegistration;
