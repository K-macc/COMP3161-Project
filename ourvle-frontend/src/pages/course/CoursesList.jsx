import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/get_courses', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCourses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching courses');
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
            <Card className="h-100 shadow-sm hover-zoom">
              <Card.Body>
                <Card.Title>{course.CourseName}</Card.Title>
                <Card.Text>{course.CourseID}</Card.Text>
                <Button variant="primary" href={`/courses/${course.CourseID}`}>
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
