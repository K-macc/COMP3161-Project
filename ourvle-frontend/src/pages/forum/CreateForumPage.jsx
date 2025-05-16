import React, { useState } from "react";
import {
  Button,
  Form,
  Container,
  Alert,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import useAuthFetch from "@/context/AuthFetch";

const CreateForum = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { courseId } = useParams();
  const authFetch = useAuthFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authFetch(`/api/courses/${courseId}/forums`, {
        body: JSON.stringify({ subject: subject }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.status !== 201) {
        setMessageType("danger");
      } else {
        setMessageType("success");
        setSubject("");
      }
      setMessage(data.message);

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    } catch (err) {
      setMessageType("danger");
      setMessage("Error creating forum!");
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={8} lg={6} className="mx-auto">
          <Card className="shadow border-0">
            <Card.Header className="bg-primary text-white text-center">
              <h4 className="mb-0">📝 Create Forum for Course {courseId}</h4>
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
                <Form.Group controlId="formSubject" className="mb-4">
                  <Form.Label>
                    <strong>Forum Subject</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter a discussion topic..."
                    className="shadow-sm"
                  />
                </Form.Group>

                <div className="text-end">
                  <Button
                    variant="success"
                    type="submit"
                    className="px-4 shadow"
                  >
                    ➕ Create Forum
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateForum;
