import { useState } from "react";
import axios from "axios";

interface Course {
  CourseID: string;
  CourseName: string;
}

interface StudentCourses {
  StudentID: string;
  StudentName: string;
  Courses: Course[];
}

export default function StudentCourses() {
  const [studentId, setStudentId] = useState("");
  const [studentCourses, setStudentCourses] = useState<StudentCourses | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchCourse = async () => {
    if (!studentId) {
      setError("Please enter a Student ID.");
      return;
    }

    setLoading(true);
    setError(null);
    setStudentCourses(null);

    try {
      const response = await axios.get<{ student_courses: StudentCourses }>(
        `http://localhost:5000/course/student/${studentId}`
      );
      setStudentCourses(response.data.student_courses);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-4">Student Courses</h1>

      <input
        type="text"
        placeholder="Enter Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <button
        onClick={handleFetchCourse}
        className="w-full bg-blue-600 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Get Courses"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {studentCourses && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold mb-2">
            Student: {studentCourses.StudentName}
          </h2>
          {studentCourses.Courses.map((course, index) => (
            <div
              key={index}
              className="mb-4 p-4 border rounded shadow-sm bg-white"
            >
              <h3 className="text-2xl font-semibold">{course.CourseName}</h3>
              <p className="text-gray-700">Course ID: {course.CourseID}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
