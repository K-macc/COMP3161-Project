import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa'; // Importing an icon from react-icons
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
      <h3>Course Members</h3>

      {/* Display error message if there's any */}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {members.map((member) => (
          <Col key={member.StudentID}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column align-items-center">
                {/* Using FontAwesome icon as a placeholder */}
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '40px',
                  }}
                >
                  <FaUserCircle size={50} />
                </div>
                <Card.Title className="mt-3">{member.StudentName}</Card.Title>
                <Button variant="outline-primary" className="mt-2">
                  View Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* If there are no members */}
      {members.length === 0 && !error && (
        <Alert variant="info">No members found for this course.</Alert>
      )}
    </div>
  );
};

export default CourseMembers;
