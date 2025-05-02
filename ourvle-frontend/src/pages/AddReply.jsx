import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AddReply = () => {
  const { threadId } = useParams();
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/threads/${threadId}/replies`,
        { reply },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Reply added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding reply');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add Reply</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formReply">
          <Form.Label>Your Reply</Form.Label>
          <Form.Control
            as="textarea"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Enter your reply"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add Reply
        </Button>
      </Form>
    </div>
  );
};

export default AddReply;
