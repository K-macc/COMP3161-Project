import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';

const CourseEvents = () => {
  const { courseId } = useParams();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/courses/${courseId}/events`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setEvents(response.data.data);  // Assumes standard_response returns { data: [...] }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching course events');
      }
    };

    fetchEvents();
  }, [courseId]);

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>Course Events</Card.Header>
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <ListGroup variant="flush">
            {events.map((event) => (
              <ListGroup.Item key={event.CalendarID}>
                <h5>{event.title}</h5>
                <p className="mb-1"><strong>Date:</strong> {new Date(event.event_date).toLocaleString()}</p>
                <p>{event.description}</p>
                <Button variant="link" href="#">
                  View Details
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CourseEvents;
