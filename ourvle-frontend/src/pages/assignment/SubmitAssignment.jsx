import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

function SubmitAssignment({ assignmentId }) {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [contentType, setContentType] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contentType) {
      setError('Please select a content type.');
      setMessage('');
      return;
    }

    const formData = new FormData();
    formData.append('content_type', contentType);
    formData.append('file', file);
    formData.append('link', link);

    try {
      const response = await axios.post(`/assignments/${assignmentId}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setMessage('');
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">📤 Submit Assignment {assignmentId}</h4>
        </Card.Header>
        <Card.Body className="bg-light">
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="contentType" className="mb-3">
              <Form.Label><strong>Content Type</strong></Form.Label>
              <Form.Control
                as="select"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option value="">--Select Content Type--</option>
                <option value="file">File</option>
                <option value="link">Link</option>
              </Form.Control>
            </Form.Group>

            {contentType === 'file' && (
              <Form.Group controlId="fileUpload" className="mb-3">
                <Form.Label><strong>Upload File</strong></Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
            )}

            {contentType === 'link' && (
              <Form.Group controlId="assignmentLink" className="mb-3">
                <Form.Label><strong>Assignment Link</strong></Form.Label>
                <Form.Control
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com"
                />
              </Form.Group>
            )}

            <div className="text-end">
              <Button type="submit" variant="success">
                ✅ Submit Assignment
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SubmitAssignment;
