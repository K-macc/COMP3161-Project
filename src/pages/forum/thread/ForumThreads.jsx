import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, Alert } from "react-bootstrap";
import { FaLongArrowAltLeft, FaInfoCircle } from "react-icons/fa";
import useAuthFetch from "@/context/AuthFetch";

const ForumThreads = () => {
  const { forumId } = useParams();
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [error, setError] = useState("");
  const role = localStorage.getItem("role");
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await authFetch(`/api/forums/${forumId}/threads`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setThreads(data);
      } catch (err) {
        setError(err.data?.message || "Error fetching threads");
      }
    };
    fetchThreads();
  }, [forumId]);

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
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-4">Forum Threads</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          {role != "student" && (
            <Button
              href={`/forums/${forumId}/threads/create-thread`}
              className="mb-3"
            >
              Create New Thread
            </Button>
          )}
        </div>

        <Row>
          {threads.map((thread) => (
            <Col md={12} className="mb-3" key={thread.ThreadID}>
              <Card
                className="shadow-sm thread-tile"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  localStorage.setItem("threadTitle", thread.Title);
                  localStorage.setItem("threadPost", thread.Post);
                  navigate(`/threads/${thread.ThreadID}/replies`);
                }}
              >
                <Card.Body>
                  <Card.Title className="mb-2">{thread.Title}</Card.Title>
                  <Card.Subtitle className="text-muted mb-2">
                    {new Date(thread.CreationDate).toLocaleString()}
                  </Card.Subtitle>
                  <Card.Text>{thread.Post}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {threads.length === 0 && !error && (
          <Alert variant="info"><FaInfoCircle/> No threads available.</Alert>
        )}
      </div>
    </>
  );
};

export default ForumThreads;
