import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Card, Alert } from "react-bootstrap";
import useAuthFetch from "@/context/AuthFetch";

const CreateEvent = () => {
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const authFetch = useAuthFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authFetch(`/api/courses/${courseId}/events`, {
        body: JSON.stringify({
          title: title,
          description: description,
          event_date: eventDate,
        }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.status !== 201) {
        setMessageType("danger");
      } else {
        setMessageType("success");
        setTitle("");
        setDescription("");
        setEventDate("");
      }
      setMessage(data.message);

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    } catch (err) {
      setMessageType("danger");
      setMessage("Error creating event!");
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-success text-white">
          <h4 className="mb-0">📅 Create A New Calendar Event</h4>
        </Card.Header>
        <Card.Body className="bg-light">
          {message && (
            <Alert
              variant={messageType === "success" ? "success" : "danger"}
              className="fade-alert position-absolute top-0 end-0 m-3"
            >
              {message}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label>
                <strong>Event Title</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label>
                <strong>Event Description</strong>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event details..."
              />
            </Form.Group>
            <Form.Group controlId="formEventDate" className="mb-4">
              <Form.Label>
                <strong>Date</strong>
              </Form.Label>
              <Form.Control
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
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
