import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, ListGroup, Button, Offcanvas, Alert } from "react-bootstrap";
import { FaThumbtack, FaRegCalendarAlt, FaLongArrowAltLeft, FaInfoCircle } from "react-icons/fa";
import useAuthFetch from "@/context/AuthFetch";

const CourseEvents = () => {
  const { courseId } = useParams();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await authFetch(`/api/courses/${courseId}/events`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setEvents(data.data);
      } catch (err) {
        setError(err.data?.message || "Error fetching course events");
      }
    };

    fetchEvents();
  }, [courseId]);

  return (
    <>
      <div className="container mt-4">
        <Button
          variant="primary"
          className="mb-3 d-flex align-items-center"
          onClick={() => navigate(-1)}
        >
          <FaLongArrowAltLeft className="me-2" />
          Back
        </Button>
      </div>
      <div className="container mt-4">
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-info text-white">
            <h4 className="mb-0">
              <FaRegCalendarAlt /> Upcoming Course Events
            </h4>
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
              <Alert variant="info" className="text-muted">
                <FaInfoCircle/> No events found for this course.
              </Alert>
            ) : (
              <ListGroup variant="flush">
                {events.map((event) => (
                  <ListGroup.Item
                    key={event.CalendarID}
                    className="mb-3 border rounded shadow-sm p-3 bg-white"
                  >
                    <h5 className="text-primary mb-1">
                      <FaThumbtack className="me-2" /> {event.title}
                    </h5>
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
            <Button
              variant="primary"
              className="mb-2 w-100"
              href={`/create-event/${courseId}`}
            >
              Create New Event
            </Button>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default CourseEvents;
