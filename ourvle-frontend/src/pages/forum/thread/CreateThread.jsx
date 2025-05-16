import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Card } from 'react-bootstrap';
import axios from 'axios';
import useAuthFetch from '@/context/AuthFetch';

const CreateThread = () => {
  const { forumId } = useParams();
  const [title, setTitle] = useState('');
  const [post, setPost] = useState('');
  const [error, setError] = useState('');
  const authFetch = useAuthFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authFetch(
        `/api/forums/${forumId}/threads`,
        { title, post },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Thread created successfully!');
      setTitle('');
      setPost('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating thread');
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">📝 Create New Thread</h4>
        </Card.Header>
        <Card.Body className="bg-light">
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label><strong>Thread Title</strong></Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter thread title"
                required
              />
            </Form.Group>
            <Form.Group controlId="formPost" className="mb-4">
              <Form.Label><strong>Post Content</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={post}
                onChange={(e) => setPost(e.target.value)}
                placeholder="Write your post here..."
                required
              />
            </Form.Group>
            <div className="text-end">
              <Button variant="success" type="submit">
                ✅ Submit Thread
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateThread;
