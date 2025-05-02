import React, { useState } from 'react';
import { Card, ListGroup, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const LecturerCourses = () => {
  const [lecturerId, setLecturerId] = useState('');
  const [lecturerCourses, setLecturerCourses] = useState([]);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLecturerCourses([]);
    setSubmitted(true);

    try {
      const response = await axios.get(`/api/lecturer_courses/${lecturerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setLecturerCourses(response.data.lecturer_info.Courses);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching Lecturer courses');
    }
  };

  return (
    <div className="container mt-4">
      <h3>View Lecturer Courses</h3>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="lecturerId">
          <Form.Label>Enter Lecturer ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="0"
            value={lecturerId}
            onChange={(e) => setLecturerId(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" className="mt-2">
          Fetch Courses
        </Button>
      </Form>

      {error && <div className="alert alert-danger">{error}</div>}

      {lecturerCourses.length > 0 && (
        <Card>
          <Card.Header>Enrolled Courses</Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {lecturerCourses.map((course) => (
                <ListGroup.Item key={course.CourseID}>
                  {course.CourseName}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {submitted && lecturerCourses.length === 0 && !error && (
        <div className="alert alert-info">No courses found for this Lecturer.</div>
      )}
    </div>
  );
};

export default LecturerCourses;
