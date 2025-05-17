import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, Form, Button } from 'react-bootstrap';
import { FaBullhorn, FaSearch, FaThumbtack, FaInfoCircle } from 'react-icons/fa';
import useAuthFetch from '@/context/AuthFetch';

const StudentEvents = () => {
  const studentId  = localStorage.getItem('ID');
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const authFetch = useAuthFetch();

  const fetchEvents = async () => {
    console.log(date);
    try {
      const response = await authFetch(`/api/students/${studentId}/events?date=${date}`);
      const data = await response.json();
      setEvents(data.data);
      setError('');
    } catch (err) {
      setEvents([]);
      setError(err.data?.message || 'Error fetching student events');
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
      <Card className="shadow-lg border-0 mt-5 mx-auto" style={{ width: "100%", maxWidth: "600px" }}>
        <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaBullhorn/> Student Events
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
                <Button variant="primary" type="submit">
                  <FaSearch/> Fetch
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
                  <h5 className="mb-2"><FaThumbtack className="me-2" /> {event.title}</h5>
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
            <Alert variant="info" className="text-muted"><FaInfoCircle/> No events found for the selected date.</Alert>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default StudentEvents;
