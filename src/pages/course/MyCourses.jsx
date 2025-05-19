import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Alert } from "react-bootstrap";
import { FaInfoCircle, FaClipboardList } from "react-icons/fa";
import useAuthFetch from "@/context/AuthFetch";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const authFetch = useAuthFetch();
  const role = localStorage.getItem("role");
  const userID = localStorage.getItem("ID");

  const fetchMyCourses = async () => {
    try {
      const endpoint =
        role === "student"
          ? `/api/student_courses/${userID}`
          : `/api/lecturer_courses/${userID}`;

      const response = await authFetch(endpoint);

      const data = await response.json();

      if (response.ok) {
        if (data.courses && data.courses.Courses) {
          setCourses(data.courses.Courses);
        } else {
          setCourses([]);
        }
        setError("");
      } else {
        if (
          response.status === 404 &&
          data.message &&
          data.message.toLowerCase().includes("no courses found")
        ) {
          setCourses([]);
          setError("");
        } else {
          setCourses([]);
          setError(data.message || "Error fetching your courses");
        }
      }
    } catch (err) {
      setCourses([]);
      setError(err.message || "Error fetching your courses");
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  return (
    <div className="container mt-4">
      <h2>My Courses</h2>

      {error && <Alert variant="warning">{error}</Alert>}

      {courses && courses.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={3} className="g-4">
          {courses.map((course) => (
            <Col key={course.CourseID} className="d-flex">
              <Card className="h-100 shadow rounded-4 bg-light card-info w-100" >
                <Card.Body className="d-flex flex-column justify-content-between p-4">
                  <div>
                    <Card.Title className="mb-3 text-primary fs-3 fw-bold">
                      {course.CourseName}
                    </Card.Title>
                    <Card.Text className="text-muted mb-4 fs-6">
                      <i className="bi bi-hash text-secondary me-2"></i>
                      <strong>Course ID:</strong> {course.CourseID}
                    </Card.Text>
                  </div>
                  <Button
                    variant="outline-primary"
                    href={`/courses/${course.CourseID}`}
                    className="w-100 mt-4 fw-semibold rounded-pill d-flex justify-content-center align-items-center gap-2"
                  >
                    <FaClipboardList />
                    View Course
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        !error && (
          <Alert variant="info">
            <FaInfoCircle /> You are not assigned to any courses yet.
          </Alert>
        )
      )}
    </div>
  );
};

export default MyCourses;
