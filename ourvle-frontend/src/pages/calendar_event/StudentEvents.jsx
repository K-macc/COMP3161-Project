import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const StudentEvents = () => {
  const { studentId } = useParams();
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`/students/${studentId}/events`, {
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
      <Card>
        <Card.Header>Student Events</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group controlId="date">
              <Form.Label>Select Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>
            <Button className="mt-2" variant="primary" type="submit">
              Fetch Events
            </Button>
          </Form>

          {submitted && error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {submitted && events.length > 0 && (
            <ListGroup variant="flush">
              {events.map((event) => (
                <ListGroup.Item key={event.CalendarID}>
                  <h5>{event.title}</h5>
                  <p className="mb-1">
                    <strong>Date:</strong>{' '}
                    {new Date(event.event_date).toLocaleString()}
                  </p>
                  <p>{event.description}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {submitted && events.length === 0 && !error && (
            <p>No events found for the selected date.</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default StudentEvents;
