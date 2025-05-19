import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  ListGroup,
  Button,
  Spinner,
  Container,
  Alert,
} from "react-bootstrap";
import {
  FaClipboardList,
  FaLongArrowAltLeft,
  FaInfoCircle,
  FaFile,
  FaLink,
  FaCalendarCheck,
} from "react-icons/fa";
import useAuthFetch from "@/context/AuthFetch";

const CourseAssignments = () => {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await authFetch(
          `/api/courses/${courseId}/assignments`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch assignments");
        }
        const data = await response.json();
        setAssignments(data);
      } catch (err) {
        setError(err.message || "Error fetching assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
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
      <Container className="mt-4">
        <Card className="shadow-sm border-0 mb-5 bg-transparent">
          <Card.Header className="bg-primary text-white d-flex align-items-center">
            <h4 className="mb-0">
              <FaClipboardList /> Assignments for {courseId}
            </h4>
          </Card.Header>
          <Card.Body className="bg-transparent">
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="light" />
                <p className="mt-2">Loading assignments...</p>
              </div>
            ) : error && assignments.length === 0 ? (
              <Alert variant="info" className="text-center">
                <FaInfoCircle /> No assignments available for this course.
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
                      <strong className="p-2">
                        <FaCalendarCheck
                          className="me-1"
                          style={{ color: "#0078d7", fontSize: "16px" }}
                        />{" "}
                        Due Date:
                      </strong>
                      {new Date(assignment.DueDate).toLocaleDateString()}
                    </p>
                    {assignment.AssignmentFile && (
                      <p className="mb-1">
                        <strong className="p-2">
                          <FaFile
                            className="me-1"
                            style={{ color: "#f9a602", fontSize: "16px" }}
                          />
                          File:
                        </strong>
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
                        <strong className="p-2">
                          <FaLink
                            className="me-1"
                            style={{ color: "#0078d7", fontSize: "16px" }}
                          />{" "}
                          Link:
                        </strong>
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
                      {role !== "student" ? (
                        <Button
                          variant="primary"
                          href={`/assignment-submissions/${assignment.AssignmentID}`}
                        >
                          Submissions
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          href={`/submit-assignment/${assignment.AssignmentID}`}
                        >
                          Submit Assignment
                        </Button>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default CourseAssignments;
