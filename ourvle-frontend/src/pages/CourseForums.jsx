import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';

const CourseForums = () => {
  const { courseId } = useParams();
  const [forums, setForums] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await axios.get(`/courses/${courseId}/forums`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setForums(response.data.forums);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching forums');
      }
    };
    fetchForums();
  }, [courseId]);

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>Course Forums</Card.Header>
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <ListGroup variant="flush">
            {forums.map((forum) => (
              <ListGroup.Item key={forum.ForumID}>
                <h5>{forum.Subject}</h5>
                <p>{forum.DateCreated}</p>
                <Button variant="link" href={`/forums/${forum.ForumID}/threads`}>
                  View Threads
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CourseForums;
