import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await axios.get('/api/specific_courses', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Check if it's a 404 message returned as valid JSON
        if (typeof response.data.courses === 'string') {
          setError(response.data.courses);
        } else {
          setCourses(response.data.courses);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching your courses');
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="container mt-4">
      <h3>My Courses</h3>
      
      {/* Display error message if any */}
      {error && <Alert variant="warning">{error}</Alert>}

      {/* Display courses in a grid of cards */}
      {!error && courses.length > 0 && (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {courses.map((course) => (
            <Col key={course.CourseID}>
              <Card className="h-100 shadow-sm card-info">
                <Card.Body>
                  <Card.Title>{course.CourseName}</Card.Title>
                  <Card.Text>
                    <strong>Course ID:</strong> {course.CourseID}
                  </Card.Text>
                  <Button variant="primary" href={`/courses/${course.CourseID}`} className="w-100">
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Show message if no courses available */}
      {!error && courses.length === 0 && (
        <Alert variant="info">You are not enrolled in any courses yet.</Alert>
      )}
    </div>
  );
};

export default MyCourses;
