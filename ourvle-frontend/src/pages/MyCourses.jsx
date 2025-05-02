import React, { useEffect, useState } from 'react';
import { ListGroup, Card } from 'react-bootstrap';
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
      {error && <div className="alert alert-warning">{error}</div>}
      {!error && (
        <ListGroup>
          {courses.map((course) => (
            <ListGroup.Item key={course.CourseID}>
              <h5>{course.CourseName}</h5>
              <a href={`/courses/${course.CourseID}`}>View Details</a>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default MyCourses;
