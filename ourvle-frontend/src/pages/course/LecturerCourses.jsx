import React, { useState } from 'react';
import { Card, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const LecturerCourses = () => {
  const [lecturerId, setLecturerId] = useState('');
  const [lecturerCourses, setLecturerCourses] = useState([]);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLecturerCourses([]);
    setSubmitted(true);
    setLoading(true);

    try {
      const response = await axios.get(`/api/lecturer_courses/${lecturerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setLecturerCourses(response.data.lecturer_info.Courses);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching Lecturer courses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <Card className="shadow p-4">
        <h3 className="mb-3 text-center">View Lecturer Courses</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="lecturerId">
            <Form.Label>Lecturer ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. 10"
              value={lecturerId}
              onChange={(e) => setLecturerId(e.target.value)}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-end mt-3">
            <Button type="submit" variant="primary">
              {loading ? <Spinner animation="border" size="sm" /> : 'Fetch Courses'}
            </Button>
          </div>
        </Form>
      </Card>

      <div className="mt-4">
        {error && <Alert variant="danger">{error}</Alert>}

        {lecturerCourses.length > 0 && (
          <Row xs={1} md={2} lg={3} className="g-4 mt-2">
            {lecturerCourses.map((course) => (
              <Col key={course.CourseID}>
                <Card className="h-100 shadow-sm border-0 hover-zoom">
                  <Card.Body>
                    <Card.Title>{course.CourseName}</Card.Title>
                    <Card.Text><strong>Course ID:</strong> {course.CourseID}</Card.Text>
                    <Button variant="outline-primary" href={`/courses/${course.CourseID}`}>
                      View Course
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {submitted && lecturerCourses.length === 0 && !error && !loading && (
          <Alert variant="info" className="mt-3">
            No courses found for this lecturer.
          </Alert>
        )}
      </div>
    </div>
  );
};

export default LecturerCourses;
