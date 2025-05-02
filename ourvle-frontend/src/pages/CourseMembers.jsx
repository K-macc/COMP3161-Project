import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup} from 'react-bootstrap';
import axios from 'axios';

const CourseMembers = () => {
  const { courseId } = useParams();
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourseMembers = async () => {
      try {
        const response = await axios.get(`/api/course_members/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMembers(response.data.members);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching members');
      }
    };
    fetchCourseMembers();
  }, [courseId]);

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>Course Members</Card.Header>
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <ListGroup variant="flush">
            {members.map((member) => (
              <ListGroup.Item key={member.StudentID}>
                {member.StudentName}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CourseMembers;
