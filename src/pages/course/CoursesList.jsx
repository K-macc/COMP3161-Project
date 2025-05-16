import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Container, Alert } from "react-bootstrap";
import useAuthFetch from "@/context/AuthFetch";

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await authFetch("/api/get_courses", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.data?.message || "Error fetching courses");
      }
    };
    fetchCourses();
  }, []);

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Available Courses</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {courses.map((course) => (
          <Col key={course.CourseID}>
            <Card className="h-100 shadow-sm rounded-4 bg-white  transition card-info">
              <Card.Body className="p-4 d-flex flex-column justify-content-between">
                <div>
                  <Card.Title className="text-primary fs-5 fw-bold mb-2">
                    {course.CourseName}
                  </Card.Title>
                  <Card.Text className="text-muted mb-4">
                    <i className="bi bi-bookmark me-2 text-secondary"></i>
                    {course.CourseID}
                  </Card.Text>
                </div>
                <Button
                  variant="outline-primary"
                  href={`/courses/${course.CourseID}`}
                  className="w-100 fw-semibold rounded-pill"
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CoursesList;
