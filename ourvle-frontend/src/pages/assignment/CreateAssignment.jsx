import React, { useState, useRef } from 'react'; // include useRef
import { Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useAuthFetch from '@/context/AuthFetch'; 

function CreateAssignment() {
  const [assignmentName, setAssignmentName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { courseId } = useParams();
  const fileInputRef = useRef();
  const authFetch = useAuthFetch();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('assignment_name', assignmentName);
    formData.append('due_date', dueDate);
    formData.append('file', file);
    formData.append('link', link);

    try {
      const response = await authFetch(`/api/${courseId}/create_assignment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setMessage(data.message);
      setError('');
      setAssignmentName('');
      setDueDate('');
      setFile(null);
      setLink('');
      fileInputRef.current.value = ''; 
    } catch (err) {
      setMessage('');
      setError(err.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">📘 Create New Assignment</h4>
        </Card.Header>
        <Card.Body className="bg-light">
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="assignmentName" className="mb-3">
              <Form.Label><strong>Assignment Name</strong></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter assignment name"
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="dueDate" className="mb-3">
              <Form.Label><strong>Due Date</strong></Form.Label>
              <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="fileUpload" className="mb-3">
              <Form.Label><strong>Upload File</strong></Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef} // 👈 attach ref
              />
            </Form.Group>

            <Form.Group controlId="assignmentLink" className="mb-4">
              <Form.Label><strong>Assignment Link (optional)</strong></Form.Label>
              <Form.Control
                type="url"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Form.Group>

            <div className="text-end">
              <Button type="submit" variant="success">
                ✅ Create Assignment
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CreateAssignment;
