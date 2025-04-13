import { useState } from "react";
import axios from "axios";

interface Course {
    message: string;
}

export default function RegisterCourse() {
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Course>({message:""});
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!courseId) {
      setError("Please enter a Course ID.");
      return;
    }

    setLoading(true);
    setMessage({ message: "" });
    setError("");

    try {
      // Retrieve JWT token (Assuming it's stored in localStorage after login)
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to register.");
        setLoading(false);
        return;
      }

      // Send registration request to Flask API
      const response = await axios.post<Course>(
        "http://localhost:5000/course/register",
        { CourseID: courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage({ message: response.data.message });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-4">Register for a Course</h1>

      <input
        type="text"
        placeholder="Enter Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <button
        onClick={handleRegister}
        className="w-full bg-blue-600 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {message.message && <p className="text-green-600 mt-4">{message.message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
