import React, { useState } from 'react';
import { Card, Row, Col, Form, Button, Spinner, Alert, Container } from 'react-bootstrap';
import axios from 'axios';

const StudentCourses = () => {
  const [studentId, setStudentId] = useState('');
  const [studentCourses, setStudentCourses] = useState([]);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStudentCourses([]);
    setSubmitted(true);
    setLoading(true);

    try {
      const response = await axios.get(`/api/student_courses/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStudentCourses(response.data.student_courses.Courses);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching student courses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Body>
              <h3 className="text-center mb-4">🎓 View Student Courses</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="studentId" className="mb-3">
                  <Form.Label><strong>Student ID</strong></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 620000000"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    className="shadow-sm"
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button type="submit" variant="primary" size="lg" className="shadow-sm">
                    {loading ? <Spinner animation="border" size="sm" /> : '🔍 Fetch Courses'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          {error && <Alert variant="danger">{error}</Alert>}

          {studentCourses.length > 0 && (
            <>
              <h5 className="mb-3">📚 Enrolled Courses:</h5>
              <Row xs={1} md={2} lg={3} className="g-4">
                {studentCourses.map((course) => (
                  <Col key={course.CourseID}>
                    <Card className="h-100 shadow-sm card-info">
                      <Card.Body>
                        <Card.Title className="text-primary">{course.CourseName}</Card.Title>
                        <Card.Text><strong>Course ID:</strong> {course.CourseID}</Card.Text>
                        <Button
                          variant="primary"
                          href={`/courses/${course.CourseID}`}
                          className="w-100 mt-2"
                        >
                          🔗 View Course
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
              ℹ️ No courses found for this student.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StudentCourses;
