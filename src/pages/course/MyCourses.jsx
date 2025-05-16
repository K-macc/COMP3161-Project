import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Alert } from "react-bootstrap";
import useAuthFetch from "@/context/AuthFetch";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const authFetch = useAuthFetch();
  const role = localStorage.getItem("role");
  const userID = localStorage.getItem("ID");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const endpoint =
          role === "student"
            ? `/api/student_courses/${userID}`
            : `/api/lecturer_courses/${userID}`;

        const response = await authFetch(endpoint);
        const data = await response.json();
        setCourses(data.courses.Courses);
      } catch (err) {
        setError(err.data?.message || "Error fetching your courses");
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="container mt-4">
      <h3>My Courses</h3>

      {error && <Alert variant="warning">{error}</Alert>}

      {!error && courses.length > 0 && (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {courses.map((course) => (
            <Col key={course.CourseID}>
              <Card className="h-100 shadow rounded-4 bg-light card-info">
                <Card.Body className="d-flex flex-column justify-content-between p-4">
                  <div>
                    <Card.Title className="mb-3 text-primary fs-4 fw-bold">
                      {course.CourseName}
                    </Card.Title>
                    <Card.Text className="text-muted mb-4">
                      <i className="bi bi-hash text-secondary me-2"></i>
                      <strong>Course ID:</strong> {course.CourseID}
                    </Card.Text>
                  </div>
                  <Button
                    variant="outline-primary"
                    href={`/courses/${course.CourseID}`}
                    className="mt-auto w-100 fw-semibold rounded-pill"
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {!error && courses.length === 0 && (
        <Alert variant="info">You are not enrolled in any courses yet.</Alert>
      )}
    </div>
  );
};

export default MyCourses;
