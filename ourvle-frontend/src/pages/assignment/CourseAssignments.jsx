import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  ListGroup,
  Button,
  Alert,
  Spinner,
  Container,
} from "react-bootstrap";
import axios from "axios";

const CourseAssignments = () => {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(
          `/api/courses/${courseId}/assignments`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAssignments(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [courseId]);

  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">📚 Assignments for {courseId}</h4>
        </Card.Header>
        <Card.Body className="bg-light">
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading assignments...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : assignments.length === 0 ? (
            <Alert variant="info">
              No assignments available for this course.
            </Alert>
          ) : (
            <ListGroup variant="flush">
              {assignments.map((assignment) => (
                <ListGroup.Item
                  key={assignment.AssignmentID}
                  className="mb-3 bg-white rounded shadow-sm p-3"
                >
                  <h5 className="fw-bold text-primary">
                    {assignment.AssignmentName}
                  </h5>
                  <p className="mb-1">
                    <strong>📅 Due Date:</strong>{" "}
                    {new Date(assignment.DueDate).toLocaleDateString()}
                  </p>
                  {assignment.AssignmentFile && (
                    <p className="mb-1">
                      <strong>📎 File:</strong>{" "}
                      <a
                        href={`/uploads/${assignment.AssignmentFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>
                    </p>
                  )}
                  {assignment.AssignmentLink && (
                    <p className="mb-1">
                      <strong>🔗 Link:</strong>{" "}
                      <a
                        href={assignment.AssignmentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {assignment.AssignmentLink}
                      </a>
                    </p>
                  )}
                  <div className="mt-3 text-start">
                    <Button variant="primary" href={`/assignment-submissions/${assignment.AssignmentID}`}> Submissions </Button>
                    <Button variant="primary" href={`/submit-assignment/${assignment.AssignmentID}`}> Submit Assignment </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CourseAssignments;
