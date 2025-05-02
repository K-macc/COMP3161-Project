import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

const CreateThread = () => {
  const { forumId } = useParams();
  const [title, setTitle] = useState('');
  const [post, setPost] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/forums/${forumId}/threads`,
        { title, post },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Thread created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating thread');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Create Thread</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle">
          <Form.Label>Thread Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter thread title"
            required
          />
        </Form.Group>
        <Form.Group controlId="formPost">
          <Form.Label>Post</Form.Label>
          <Form.Control
            as="textarea"
            value={post}
            onChange={(e) => setPost(e.target.value)}
            placeholder="Enter your post"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Thread
        </Button>
      </Form>
    </div>
  );
};

export default CreateThread;
