import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/get_course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCourse(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching course');
      }
    };
    fetchCourse();
  }, [courseId]);

  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      {course && (
        <Card>
          <Card.Header>{course.CourseName}</Card.Header>
          <Card.Body>
            <Card.Title>{course.CourseID}</Card.Title>
            <Button variant="primary" href={`/course-members/${course.CourseID}`}>Get Members</Button>
            <Button variant="primary" href={`/create-forum/${course.CourseID}`}>Create New Forum</Button>
            <Button variant="primary" href={`/get-forums/${course.CourseID}`}>Get All Forums</Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CourseDetail;
