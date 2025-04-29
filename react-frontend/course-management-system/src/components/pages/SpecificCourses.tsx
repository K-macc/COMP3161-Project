import { useState, useEffect } from "react";
import axios from "axios";

interface Course {
  CourseID: string;
  CourseName: string;
}

export default function SpecificLecturerCourses() {
  const [courses, setCourses] = useState<Course[] | []>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setError(null);
      setCourses([]);

      try {
        const token = localStorage.getItem("token"); // Retrieve token
        if (!token) {
          return;
        }
        const response = await axios.get<{ courses: Course[] }>(
          "http://localhost:5000/course/specific-courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourses(response.data.courses);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch courses.");
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-4">My Courses</h1>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {courses.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          {courses.map((course, index) => (
            <div
              key={index}
              className="mb-4 p-4 border rounded shadow-sm bg-white"
            >
              <h2 className="text-2xl font-semibold">{course.CourseName}</h2>
              <p className="text-gray-700">Course ID: {course.CourseID}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
