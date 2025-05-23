import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Table, Spinner, Button, Alert } from "react-bootstrap";
import { FaLongArrowAltLeft, FaInfoCircle, FaFileUpload } from "react-icons/fa";
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
        if (!response.ok) {
          throw new Error("Failed to fetch submissions.");
        }
        const data = await response.json();
        setSubmissions(data || []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to fetch submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

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
      <div className="container mt-4">
        <Card className="shadow-sm border-0 mb-5 bg-transparent">
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">
              <FaFileUpload /> Assignment Submissions
            </h4>
          </Card.Header>
          <Card.Body className="bg-light bg-transparent">
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="light"/>
              </div>
            ) : error ? (
              <p className="text-danger text-center">Error: {error}</p>
            ) : submissions.length === 0 ? (
              <Alert variant="info" className="text-center">
                <FaInfoCircle /> No submissions found.
              </Alert>
            ) : (
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th className="text-center">Student</th>
                    <th className="text-center">Submission File</th>
                    <th className="text-center">Submission Link</th>
                    <th className="text-center">Submitted At</th>
                    <th className="text-center">Action</th>
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
                      <td>
                        {new Date(sub.SubmissionDate).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td>
                        <Link
                          to={`/grade-assignment/${assignmentId}/${sub.StudentID}`}
                          className="d-flex justify-content-center"
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
