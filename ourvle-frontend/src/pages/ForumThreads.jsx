import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';

const ForumThreads = () => {
  const { forumId } = useParams();
  const [threads, setThreads] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await axios.get(`/forums/${forumId}/threads`, {
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
      <Card>
        <Card.Header>Forum Threads</Card.Header>
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <ListGroup variant="flush">
            {threads.map((thread) => (
              <ListGroup.Item key={thread.ThreadID}>
                <h5>{thread.Title}</h5>
                <p>{thread.CreationDate}</p>
                <Button variant="link" href={`/threads/${thread.ThreadID}/replies`}>
                  View Replies
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ForumThreads;
