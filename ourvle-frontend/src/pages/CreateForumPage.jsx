import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CreateForum = () => {
  const [subject, setSubject] = useState('');
  const [error, setError] = useState('');
  const { courseId } = useParams(); // Replace with dynamic course ID

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/api/courses/${courseId}/forums`,
        { subject },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Forum created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating forum');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Create Forum</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formSubject">
          <Form.Label>Forum Subject</Form.Label>
          <Form.Control
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter forum subject"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Forum
        </Button>
      </Form>
    </div>
  );
};

export default CreateForum;
