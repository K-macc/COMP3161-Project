import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Table, Alert, Spinner, Button } from "react-bootstrap";
import useAuthFetch from "@/context/AuthFetch"; 

const AssignmentSubmissions = () => {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await authFetch(
          `/api/assignments/${assignmentId}/submissions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setSubmissions(data || []);
        setError("");
      } catch (err) {
        setError(err.data?.message || "Failed to fetch submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  return (
    <>
      <div className="container mt-4">
        <Button variant="primary" className="mb-3" onClick={() => navigate(-1)}>
          ⬅️ Back
        </Button>
      </div>
      <div className="container mt-4">
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">📄 Assignment Submissions</h4>
          </Card.Header>
          <Card.Body className="bg-light">
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" />
              </div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : submissions.length === 0 ? (
              <Alert variant="info">No submissions found.</Alert>
            ) : (
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Submission File</th>
                    <th>Submission Link</th>
                    <th>Submitted At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.SubmissionID}>
                      <td>{sub.StudentID}</td>
                      <td>
                        {sub.SubmissionFile ? (
                          <a
                            href={`/uploads/${sub.SubmissionFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {sub.SubmissionFile}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        {sub.SubmissionLink ? (
                          <a
                            href={sub.SubmissionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {sub.SubmissionLink}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>{new Date(sub.SubmissionDate).toLocaleString()}</td>
                      <td>
                        <Link
                          to={`/grade-assignment/${assignmentId}/${sub.StudentID}`}
                        >
                          <Button variant="success" size="sm">
                            Grade
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default AssignmentSubmissions;
