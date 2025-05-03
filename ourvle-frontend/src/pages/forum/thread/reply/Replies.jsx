import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';

const ThreadReplies = () => {
  const { threadId } = useParams(); // Get threadId from URL
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch replies for the thread when the component is mounted
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await axios.get(`/api/threads/${threadId}/replies`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Use JWT from localStorage
          },
        });
        setReplies(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching replies');
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [threadId]);

  // Render loading state or error message
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>Replies for Thread {threadId}</Card.Header>
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <ListGroup variant="flush">
            {replies.length === 0 ? (
              <p>No replies yet.</p>
            ) : (
              replies.map((reply) => (
                <ListGroup.Item key={reply.ReplyID}>
                  <h5>{reply.UserName}</h5>
                  <p>{reply.Reply}</p>
                  <p><small>{reply.CreationDate}</small></p>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
          <Button variant="primary" href={`/threads/${threadId}/create-reply`}>
            Add Reply
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ThreadReplies;
