import React, { useState, useRef } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import useAuthFetch from '@/context/AuthFetch';

function CreateSectionContent() {
  const [slides, setSlides] = useState(null);
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { courseId } = useParams();
  const authFetch = useAuthFetch();

  const slidesInputRef = useRef();
  const fileInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const formData = new FormData();
    if (slides) formData.append('slides', slides);
    if (file) formData.append('file', file);
    formData.append('link', link);

    try {
      const response = await authFetch(
        `/api/section/${courseId}/content`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const data = await response.json(); 
      setMessage(data.message);
      setSlides(null);
      setFile(null);
      setLink('');
      slidesInputRef.current.value = '';
      fileInputRef.current.value = '';
    } catch (err) {
      setError(err.data?.message || 'Upload failed.');
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">📚 Create New Section</h4>
        </Card.Header>
        <Card.Body className="bg-light">
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group controlId="slidesUpload" className="mb-3">
              <Form.Label><strong>Lecture Slides (PDF/PPT)</strong></Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={(e) => setSlides(e.target.files[0])}
                ref={slidesInputRef}
                required
              />
            </Form.Group>

            <Form.Group controlId="fileUpload" className="mb-3">
              <Form.Label><strong>Additional File</strong></Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                ref={fileInputRef}
                required
              />
            </Form.Group>

            <Form.Group controlId="sectionLink" className="mb-4">
              <Form.Label><strong>External Link</strong></Form.Label>
              <Form.Control
                type="url"
                placeholder="https://example.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Form.Group>

            <div className="text-end">
              <Button type="submit" variant="success">
                📥 Create Section
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CreateSectionContent;
