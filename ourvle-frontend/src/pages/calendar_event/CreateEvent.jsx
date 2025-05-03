import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

const CreateEvent = () => {
  const { courseId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/courses/${courseId}/events`,
        { title, description, event_date: eventDate },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Event created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating event');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Create Event</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle">
          <Form.Label>Event Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
            required
          />
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>Event Description</Form.Label>
          <Form.Control
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter event description"
            required
          />
        </Form.Group>
        <Form.Group controlId="formEventDate">
          <Form.Label>Event Date</Form.Label>
          <Form.Control
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Event
        </Button>
      </Form>
    </div>
  );
};

export default CreateEvent;
