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
  FaUserGraduate,
  FaSearch,
  FaLayerGroup,
  FaClipboardList,
} from "react-icons/fa";
import useAuthFetch from "@/context/AuthFetch";

const StudentCourses = () => {
  const [studentId, setStudentId] = useState("");
  const [studentCourses, setStudentCourses] = useState([]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const authFetch = useAuthFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStudentCourses([]);
    setSubmitted(true);
    setLoading(true);

    if (!studentId) {
      setLoading(false);
      setError("Please enter a valid Student ID!");
      return;
    }

    try {
      const response = await authFetch(`/api/student_courses/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        if (data.courses && data.courses.Courses) {
          setStudentCourses(data.courses.Courses);
        } else {
          setStudentCourses([]);
        }
        setError("");
      } else {
        if (
          response.status === 404 &&
          data.message &&
          data.message.toLowerCase().includes("no courses found")
        ) {
          setStudentCourses([]);
          setError("");
        } else {
          setStudentCourses([]);
          setError(data.message || "Error fetching your courses");
        }
      }
    } catch (err) {
      setError(err.data?.message || "Error fetching student courses");
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
                <FaUserGraduate /> View Student Courses
              </h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="studentId" className="mb-3">
                  <Form.Label>
                    <strong>Student ID</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 620000000"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
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
          {studentCourses.length > 0 && (
            <>
              <h5 className="mb-3 text-white">
                <FaLayerGroup /> Enrolled Courses:
              </h5>
              <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {studentCourses.map((course) => (
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

          {submitted && studentCourses.length === 0 && !error && !loading && (
            <Alert variant="info" className="mt-3 text-center">
              <FaInfoCircle /> No courses found for this student.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StudentCourses;
