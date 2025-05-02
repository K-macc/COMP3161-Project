import React, { useState } from 'react';
import { Card, ListGroup, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const StudentCourses = () => {
  const [studentId, setStudentId] = useState('');
  const [studentCourses, setStudentCourses] = useState([]);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStudentCourses([]);
    setSubmitted(true);

    try {
      const response = await axios.get(`/api/student_courses/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStudentCourses(response.data.student_courses.Courses);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching student courses');
    }
  };

  return (
    <div className="container mt-4">
      <h3>View Student Courses</h3>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="studentId">
          <Form.Label>Enter Student ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="620000000"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" className="mt-2">
          Fetch Courses
        </Button>
      </Form>

      {error && <div className="alert alert-danger">{error}</div>}

      {studentCourses.length > 0 && (
        <Card>
          <Card.Header>Enrolled Courses</Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {studentCourses.map((course) => (
                <ListGroup.Item key={course.CourseID}>
                  {course.CourseName}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {submitted && studentCourses.length === 0 && !error && (
        <div className="alert alert-info">No courses found for this student.</div>
      )}
    </div>
  );
};

export default StudentCourses;
