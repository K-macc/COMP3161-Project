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
import { useNavigate } from "react-router-dom";
import { FaForumbee, FaPlusCircle, FaLongArrowAltLeft } from "react-icons/fa";

const CreateForum = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { courseId } = useParams();
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
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
        setTimeout(() => {
          navigate(`/get-forums/${courseId}`);
        }, 5000);
      }
      setMessage(data.message);
    } catch (err) {
      setMessageType("danger");
      setMessage("Error creating forum!");
    }
  };

  return (
    <Container className="mt-5">
      <div className="container mt-4">
        <Button
          variant="primary"
          className="mb-3 d-flex align-items-center"
          onClick={() => navigate(`/courses/${courseId}`)}
        >
          <FaLongArrowAltLeft className="me-2" />
          Back
        </Button>
      </div>
      <Row>
        <Col md={8} lg={6} className="mx-auto">
          <Card className="shadow border-0">
            <Card.Header className="bg-success text-white text-center">
              <h4 className="mb-0">
                <FaForumbee className="me-2" />
                Create Forum for {courseId}
              </h4>
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
                    variant="primary"
                    type="submit"
                    className="px-4 shadow"
                  >
                    <FaPlusCircle className="me-2 text-white" />
                    Create Forum
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
