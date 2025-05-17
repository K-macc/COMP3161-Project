import React, { useState, useRef } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import useAuthFetch from "@/context/AuthFetch";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaClipboardList, FaLongArrowAltLeft } from "react-icons/fa";

function CreateAssignment() {
  const [assignmentName, setAssignmentName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { courseId } = useParams();
  const fileInputRef = useRef();
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const formData = new FormData();
    formData.append("assignment_name", assignmentName);
    formData.append("due_date", dueDate);
    formData.append("file", file);
    formData.append("link", link);

    try {
      const response = await authFetch(`/api/${courseId}/create_assignment`, {
        body: formData,
        method: "POST",
      });
      const data = await response.json();
      if (response.status !== 201) {
        setMessageType("danger");
      } else {
        setMessageType("success");
        setAssignmentName("");
        setDueDate("");
        setFile(null);
        setLink("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setTimeout(() => {
          navigate(`/get-assignments/${courseId}`);
        }, 5000);
      }

      setMessage(data.message);
    } catch (err) {
      setMessageType("danger");
      setMessage("Error creating Assignment!");
    }
  };

  return (
    <div className="container mt-4">
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
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-success text-white">
          <h4 className="mb-0">
            <FaClipboardList /> Create New Assignment
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
            <Form.Group controlId="assignmentName" className="mb-3">
              <Form.Label>
                <strong>Assignment Name</strong>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter assignment name"
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="dueDate" className="mb-3">
              <Form.Label>
                <strong>Due Date</strong>
              </Form.Label>
              <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </Form.Group>

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

            <Form.Group controlId="assignmentLink" className="mb-4">
              <Form.Label>
                <strong>Assignment Link (optional)</strong>
              </Form.Label>
              <Form.Control
                type="url"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Form.Group>

            <div className="text-end">
              <Button type="submit" variant="primary">
                <FaFileAlt /> Create Assignment
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CreateAssignment;
