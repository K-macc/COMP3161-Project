import React, { useState } from 'react';
import { Button, Form, Container, Alert, Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import useAuthFetch from "@/context/AuthFetch";

const CreateForum = () => {
  const [subject, setSubject] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { courseId } = useParams();
  const authFetch = useAuthFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await authFetch(
        `/api/courses/${courseId}/forums`,
        { subject },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();
      setSuccess('✅ Forum created successfully!');
      setSubject('');
    } catch (err) {
      setError(err.data?.message || '❌ Error creating forum');
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={8} lg={6} className="mx-auto">
          <Card className="shadow border-0">
            <Card.Header className="bg-primary text-white text-center">
              <h4 className="mb-0">📝 Create Forum for Course {courseId}</h4>
            </Card.Header>
            <Card.Body className="bg-light">
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formSubject" className="mb-4">
                  <Form.Label><strong>Forum Subject</strong></Form.Label>
                  <Form.Control
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter a discussion topic..."
                    className="shadow-sm"
                    required
                  />
                </Form.Group>

                <div className="text-end">
                  <Button variant="success" type="submit" className="px-4 shadow">
                    ➕ Create Forum
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateForum;
