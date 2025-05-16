import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Card } from 'react-bootstrap';
import useAuthFetch from '@/context/AuthFetch';

const CreateEvent = () => {
  const { courseId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [error, setError] = useState('');
  const authFetch = useAuthFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authFetch(
        `/api/courses/${courseId}/events`,
        { title, description, event_date: eventDate },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Event created successfully!');
      setTitle('');
      setDescription('');
      setEventDate('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating event');
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-success text-white">
          <h4 className="mb-0">📅 Create A New Calendar Event</h4>
        </Card.Header>
        <Card.Body className="bg-light">
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label><strong>Event Title</strong></Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label><strong>Event Description</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event details..."
                required
              />
            </Form.Group>
            <Form.Group controlId="formEventDate" className="mb-4">
              <Form.Label><strong>Date</strong></Form.Label>
              <Form.Control
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </Form.Group>
            <div className="text-end">
              <Button variant="primary" type="submit">
                📌 Create Calendar Event
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateEvent;
