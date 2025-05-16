import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import useAuthFetch from "@/context/AuthFetch";

function GradeAssignment() {
  const [grade, setGrade] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { assignmentId } = useParams();
  const { studentId } = useParams();
  const authFetch = useAuthFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await authFetch(
        `/api/${assignmentId}/${studentId}/grade`,
        {
          body: JSON.stringify({ grade: grade }),
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (response.status !== 201) {
        setMessageType("danger");
      } else {
        setMessageType("success");
        setGrade("");
      }
      setMessage(data.message);

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    } catch (err) {
      setMessageType("danger");
      setMessage("An error occurred while grading!");
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-info text-white">
          <h4 className="mb-0">📊 Grade Assignment</h4>
        </Card.Header>
        <Card.Body className="bg-light">
          <p>
            <strong>Assignment ID:</strong> {assignmentId}
          </p>
          <p>
            <strong>Student ID:</strong> {studentId}
          </p>

          {message && (
            <Alert
              variant={messageType === "success" ? "success" : "danger"}
              className="fade-alert position-absolute top-0 end-0 m-3"
            >
              {message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="grade" className="mb-3">
              <Form.Label>
                <strong>Grade (0 - 100)</strong>
              </Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Enter grade"
                required
              />
            </Form.Group>

            <div className="text-end">
              <Button type="submit" variant="primary">
                ✅ Submit Grade
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default GradeAssignment;
