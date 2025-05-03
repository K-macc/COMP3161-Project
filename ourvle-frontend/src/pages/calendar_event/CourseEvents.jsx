import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, ListGroup, Button, Offcanvas } from "react-bootstrap";
import axios from "axios";

const CourseEvents = () => {
  const { courseId } = useParams();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/api/courses/${courseId}/events`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEvents(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching course events");
      }
    };

    fetchEvents();
  }, [courseId]);

  return (
    <div className="container mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-info text-white">
          <h4 className="mb-0">📅 Upcoming Course Events</h4>
        </Card.Header>
        <Card.Body className="bg-light">
          <div className="text-end mb-3">
            <Button variant="primary" onClick={() => setShowSidebar(true)}>
              {" "}
              Open Menu{" "}
            </Button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {events.length === 0 ? (
            <p className="text-muted">No events found for this course.</p>
          ) : (
            <ListGroup variant="flush">
              {events.map((event) => (
                <ListGroup.Item
                  key={event.CalendarID}
                  className="mb-3 border rounded shadow-sm p-3 bg-white"
                >
                  <h5 className="text-primary mb-1">📌 {event.title}</h5>
                  <p className="mb-1">
                    <strong>Date:</strong>{" "}
                    {new Date(event.event_date).toLocaleString()}
                  </p>
                  <p className="text-muted">{event.description}</p>
                  <div className="text-end">
                    <Button variant="outline-primary" size="sm" disabled>
                      View Details
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Event Options</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Button variant="primary" className="mb-2 w-100" href={`/create-event/${courseId}`}>
              Create New Event
            </Button>
            <Button variant="primary" className="mb-2 w-100" href={`/student-events`}>
              View Student Events
            </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default CourseEvents;
