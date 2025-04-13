import { useState, useEffect } from "react";
import axios from "axios";

interface Student {
  StudentID: string;
  StudentName: string;
}

interface LecturerCourses {
  CourseID: string;
  CourseName: string;
}

export default function CourseMembers() {
  const [courseId, setCourseId] = useState("");
  const [student, setStudent] = useState<Student[] | []>([]);
  const [lecturerCourses, setLecturerCourses] = useState<
    LecturerCourses[] | string
  >("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLecturerCourses = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token
        if (!token) {
          return;
        }
        const response = await axios.get<{
          courses: LecturerCourses[] | string;
        }>("http://localhost:5000/course/specific-courses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLecturerCourses(response.data.courses);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to fetch lecturer courses."
        );
      }
    };
    fetchLecturerCourses();
  }, []);

  const handleFetchCourse = async () => {
    if (!courseId) {
      setError("Please enter a Course ID.");
      return;
    }

    setLoading(true);
    setError(null);
    setStudent([]);

    try {
      const response = await axios.get<{ members: Student[] }>(
        `http://localhost:5000/course/${courseId}`
      );
      setStudent(response.data.members);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch members.");
    } finally {
      setLoading(false);
    }
  };

  const renderCourseInput = () => {
    if (typeof lecturerCourses === "string") {
      return (
        <input
          type="text"
          placeholder="Enter Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
      );
    } else {
      return (
        <>
          <label
            htmlFor="course-select"
            className="block text-sm mb-1 font-medium"
          >
            Select a Course
          </label>
          <select
            id="course-select"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">--Select a Course--</option>
            {lecturerCourses.map((course, index) => (
              <option key={index} value={course.CourseID}>
                {course.CourseName}
              </option>
            ))}
          </select>
        </>
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-4">Get Members Of A Specific Course</h1>

      {renderCourseInput()}

      <button
        onClick={handleFetchCourse}
        className="w-full bg-blue-600 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Get Members"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {student.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          {student.map((student, index) => (
            <div
              key={index}
              className="mb-4 p-4 border rounded shadow-sm bg-white"
            >
              <h2 className="text-2xl font-semibold">{student.StudentName}</h2>
              <p className="text-gray-700">Student ID: {student.StudentID}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
