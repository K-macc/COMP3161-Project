import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ForumThreads = () => {
  const { forumId } = useParams();
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await axios.get(`/api/forums/${forumId}/threads`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setThreads(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching threads');
      }
    };
    fetchThreads();
  }, [forumId]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
      <h3 className="mb-4">Forum Threads</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {threads.length === 0 && !error && <p>No threads available.</p>}
      <Button href={`/forums/${forumId}/threads/create-thread`} className="mb-3"> Create New Thread </Button>
    </div>

      <Row>
        {threads.map((thread) => (
          <Col md={12} className="mb-3" key={thread.ThreadID}>
            <Card
              className="shadow-sm thread-tile"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/threads/${thread.ThreadID}/replies`)}
            >
              <Card.Body>
                <Card.Title className="mb-2">{thread.Title}</Card.Title>
                <Card.Subtitle className="text-muted mb-2">
                  {new Date(thread.CreationDate).toLocaleString()}
                </Card.Subtitle>
                <Card.Text>{thread.Post}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ForumThreads;
