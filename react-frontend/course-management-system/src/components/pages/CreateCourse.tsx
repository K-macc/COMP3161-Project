import { useState } from "react";
import axios from "axios";

interface Course {
  CourseID: string;
  CourseName: string;
  message: string;
}

export default function CreateCourse() {
  const [course, setCourse] = useState<Course>({ CourseID: "", CourseName: "" , message: ""});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCourse({ ...course, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const token = localStorage.getItem("token"); // Get JWT token from localStorage
    if (!token) {
      setError("You must be logged in as an admin.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post<Course>(
        "http://localhost:5000/course/create",
        course,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT token
          },
        }
      );

      setMessage(response.data.message);
      setCourse({ CourseID: "", CourseName: "" ,message:""}); // Clear form after successful submission
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-4">Create A Course</h1>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="CourseID"
          placeholder="Course ID"
          value={course.CourseID}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="CourseName"
          placeholder="Course Name"
          value={course.CourseName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}
