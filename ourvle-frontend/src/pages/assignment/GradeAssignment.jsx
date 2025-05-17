import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function GradeAssignment() {
  const [grade, setGrade] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { assignmentId } = useParams();
  const { studentId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (grade < 0 || grade > 100) {
      setMessage('');
      return setError('❗ Grade must be between 0 and 100');
    }

    try {
      const response = await axios.post(
        `/api/${assignmentId}/${studentId}/grade`,
        { grade },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setMessage('');
      setError(err.response?.data?.message || 'An error occurred while grading');
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-info text-white">
          <h4 className="mb-0">📊 Grade Assignment</h4>
        </Card.Header>
        <Card.Body className="bg-light">
          <p><strong>Assignment ID:</strong> {assignmentId}</p>
          <p><strong>Student ID:</strong> {studentId}</p>

          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="grade" className="mb-3">
              <Form.Label><strong>Grade (0 - 100)</strong></Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Enter grade"
                required
              />
            </Form.Group>

            <div className="text-end">
              <Button type="submit" variant="primary">
                ✅ Submit Grade
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default GradeAssignment;
