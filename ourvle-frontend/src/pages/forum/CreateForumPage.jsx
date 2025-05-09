import React, { useState } from 'react';
import { Button, Form, Container, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CreateForum = () => {
  const [subject, setSubject] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { courseId } = useParams(); // Replace with dynamic course ID

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(
        `/api/courses/${courseId}/forums`,
        { subject },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSuccess('Forum created successfully!');
      setSubject(''); // Clear input field
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating forum');
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6} className="mx-auto">
          <h3 className="text-center mb-4">Create a New Forum</h3>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formSubject" className="mb-4">
              <Form.Label>Forum Subject</Form.Label>
              <Form.Control
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter forum subject"
                required
                className="shadow-sm"
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" size="lg" className="shadow-lg">
                Create Forum
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateForum;
