import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Card, Alert } from "react-bootstrap";
import useAuthFetch from "@/context/AuthFetch";
import { useNavigate } from "react-router-dom";

const CreateThread = () => {
  const { forumId } = useParams();
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    try {
      const response = await authFetch(`/api/forums/${forumId}/threads`, {
        body: JSON.stringify({ title: title, post: post }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.status !== 201) {
        setMessageType("danger");
      } else {
        setMessageType("success");
        setTitle("");
        setPost("");
        setTimeout(() => {
          navigate(`/forums/${forumId}/threads`);
        }, 5000);
      }
      setMessage(data.message);
    } catch (err) {
      setMessageType("danger");
      setMessage("Error creating thread!");
    }
  };

  return (
    <div className="container mt-4">
      <div className="container mt-4">
        <Button
          variant="primary"
          className="mb-3"
          onClick={() => navigate(`/courses/${localStorage.getItem("CourseID")}`)}
        >
          ⬅️ Back
        </Button>
      </div>
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">📝 Create New Thread</h4>
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
                <strong>Thread Title</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter thread title"
              />
            </Form.Group>
            <Form.Group controlId="formPost" className="mb-4">
              <Form.Label>
                <strong>Post Content</strong>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={post}
                onChange={(e) => setPost(e.target.value)}
                placeholder="Write your post here..."
              />
            </Form.Group>
            <div className="text-end">
              <Button variant="success" type="submit">
                ✅ Submit Thread
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateThread;
