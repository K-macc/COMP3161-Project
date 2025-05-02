import React, { useEffect, useState } from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
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
    <div className="container mt-4">
      <h3>Available Courses</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <ListGroup>
        {courses.map((course) => (
          <ListGroup.Item key={course.CourseID}>
            <h5>{course.CourseName}</h5>
            <Button variant="link" href={`/courses/${course.CourseID}`}>
              View Details
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default CoursesList;
