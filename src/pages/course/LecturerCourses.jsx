import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
  Container,
} from "react-bootstrap";
import {
  FaInfoCircle,
  FaSearch,
  FaChalkboardTeacher,
  FaLayerGroup,
  FaClipboardList,
} from "react-icons/fa";
import useAuthFetch from "@/context/AuthFetch";

const LecturerCourses = () => {
  const [lecturerId, setLecturerId] = useState("");
  const [lecturerCourses, setLecturerCourses] = useState([]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const authFetch = useAuthFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLecturerCourses([]);
    setSubmitted(true);
    setLoading(true);

    if (!lecturerId) {
      setLoading(false);
      setError("Please enter a valid Lecturer ID!");
      return;
    }

    try {
      const response = await authFetch(`/api/lecturer_courses/${lecturerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        if (data.courses && data.courses.Courses) {
          setLecturerCourses(data.courses.Courses);
        } else {
          setLecturerCourses([]);
        }
        setError("");
      } else {
        if (
          response.status === 404 &&
          data.message &&
          data.message.toLowerCase().includes("no courses found")
        ) {
          setLecturerCourses([]);
          setError("");
        } else {
          setLecturerCourses([]);
          setError(data.message || "Error fetching your courses");
        }
      }
    } catch (err) {
      setError(err.data?.message || "Error fetching lecturer courses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg position-relative border-0">
            {error && (
              <Alert
                variant="danger"
                className="fade-alert position-absolute top-0 end-0 m-3"
              >
                {error}
              </Alert>
            )}
            <Card.Header className="bg-success text-white d-flex justify-content-center align-items-center">
              <h3 className="mb-0">
                <FaChalkboardTeacher /> View Lecturer Courses
              </h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="lecturerId" className="mb-3">
                  <Form.Label>
                    <strong>Lecturer ID</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 10"
                    value={lecturerId}
                    onChange={(e) => setLecturerId(e.target.value)}
                    className="shadow-sm"
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="btn-set"
                  >
                    {loading ? (
                      <Spinner animation="border" size="md" variant="light"/>
                    ) : (
                      <>
                        <FaSearch /> Fetch Courses
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          {lecturerCourses.length > 0 && (
            <>
              <h5 className="mb-3 text-white">
                <FaLayerGroup /> Assigned Courses:
              </h5>
              <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {lecturerCourses.map((course) => (
                  <Col key={course.CourseID}>
                    <Card className="h-100 shadow-sm rounded-4 bg-white card-info">
                      <Card.Body className="p-4 d-flex flex-column justify-content-between">
                        <div>
                          <Card.Title className="text-primary fs-4 fw-bold mb-3">
                            {course.CourseName}
                          </Card.Title>
                          <Card.Text className="text-muted">
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
            </>
          )}

          {submitted && lecturerCourses.length === 0 && !error && !loading && (
            <Alert variant="info" className="mt-3 text-center">
              <FaInfoCircle /> No courses found for this lecturer.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default LecturerCourses;
