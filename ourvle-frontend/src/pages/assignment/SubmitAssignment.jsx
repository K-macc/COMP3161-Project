import React, { useState, useRef } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import useAuthFetch from "@/context/AuthFetch";

function SubmitAssignment() {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [contentType, setContentType] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { assignmentId } = useParams();
  const authFetch = useAuthFetch();

  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contentType) {
      setMessageType("danger");
      setMessage("Please select a content type.");
      return;
    }

    const formData = new FormData();
    formData.append("content_type", contentType);
    formData.append("file", file);
    formData.append("link", link);

    try {
      const response = await authFetch(
        `/api/assignments/${assignmentId}/submit`,
        {
          body: formData,
          method: "POST",
        }
      );
      const data = await response.json();
      if (response.status !== 201) {
        setMessageType("danger");
      } else {
        setMessageType("success");
        setFile(null);
        setLink("");
        setContentType("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
      setMessage(data.message);

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    } catch (err) {
      setMessageType("danger");
      setMessage("Error submitting Assignment!");
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">📤 Submit Assignment</h4>
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
            <Form.Group controlId="contentType" className="mb-3">
              <Form.Label>
                <strong>Content Type</strong>
              </Form.Label>
              <Form.Control
                as="select"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option value="">--Select Content Type--</option>
                <option value="file">File</option>
                <option value="link">Link</option>
              </Form.Control>
            </Form.Group>

            {contentType === "file" && (
              <Form.Group controlId="fileUpload" className="mb-3">
                <Form.Label>
                  <strong>Upload File</strong>
                </Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </Form.Group>
            )}

            {contentType === "link" && (
              <Form.Group controlId="assignmentLink" className="mb-3">
                <Form.Label>
                  <strong>Assignment Link</strong>
                </Form.Label>
                <Form.Control
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com"
                />
              </Form.Group>
            )}

            <div className="text-end">
              <Button type="submit" variant="success">
                ✅ Submit Assignment
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SubmitAssignment;
