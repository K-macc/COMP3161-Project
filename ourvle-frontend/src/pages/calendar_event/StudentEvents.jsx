import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const StudentEvents = () => {
  const studentId  = localStorage.getItem('ID');
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`/api/students/${studentId}/events`, {
        params: { date },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEvents(response.data.data);
      setError('');
    } catch (err) {
      setEvents([]);
      setError(err.response?.data?.message || 'Error fetching student events');
    }
    setSubmitted(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date) {
      fetchEvents();
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            🎓 Student Events
          </h5>
        </Card.Header>
        <Card.Body className="bg-light">
          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group controlId="date">
              <Form.Label><strong>Select a Date</strong></Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="date"
                  className="me-2"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <Button variant="success" type="submit">
                  🔍 Fetch
                </Button>
              </div>
            </Form.Group>
          </Form>

          {submitted && error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {submitted && events.length > 0 && (
            <ListGroup variant="flush">
              {events.map((event) => (
                <ListGroup.Item key={event.CalendarID} className="bg-white rounded shadow-sm mb-3 p-3">
                  <h5 className="mb-2">📌 {event.title}</h5>
                  <p className="mb-1 text-muted">
                    <i className="bi bi-calendar-event"></i>{' '}
                    <strong>Date:</strong> {new Date(event.event_date).toLocaleString()}
                  </p>
                  <p>
                    <i className="bi bi-chat-left-text"></i>{' '}
                    {event.description}
                  </p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {submitted && events.length === 0 && !error && (
            <p className="text-muted">No events found for the selected date.</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default StudentEvents;
