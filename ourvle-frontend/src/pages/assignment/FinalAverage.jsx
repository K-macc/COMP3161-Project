import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';

function FinalAverage() {
  const [finalAverage, setFinalAverage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { studentId } = useParams();

  useEffect(() => {
    const fetchFinalAverage = async () => {
      try {
        const response = await axios.get(`/api/${studentId}/final_average`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFinalAverage(response.data.final_average);
      } catch (error) {
        setMessage(error.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFinalAverage();
  }, [studentId]);

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="shadow p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <Card.Body className="text-center">
          <Card.Title className="mb-4 text-primary">📊 Final Average</Card.Title>

          <h5 className="mb-3 text-muted">Student ID: {studentId}</h5>

          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : message ? (
            <Alert variant="danger">{message}</Alert>
          ) : finalAverage !== null ? (
            <Alert variant="success">
              Your final average for this course is: <strong>{finalAverage}</strong>
            </Alert>
          ) : (
            <Alert variant="info">No grades found for this student.</Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default FinalAverage;
