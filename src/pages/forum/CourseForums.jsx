import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  ListGroup,
  Button,
  Row,
  Col,
  Alert,
  Container,
} from "react-bootstrap";
import { FaLongArrowAltLeft, FaInfoCircle } from "react-icons/fa";
import useAuthFetch from "@/context/AuthFetch";

const CourseForums = () => {
  const { courseId } = useParams();
  const [forums, setForums] = useState([]);
  const [error, setError] = useState("");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await authFetch(`/api/courses/${courseId}/forums`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        setForums(data.forums);
      } catch (err) {
        console.error("Error fetching forums:", err);
        setError(err?.data?.message || "Error fetching forums");
      }
    };

    fetchForums();
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

      <Container className="mt-5">
        <Row>
          <Col md={8} className="mx-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="text-center">Course Forums</h2>

              {role !== "student" && (
                <Button href={`/create-forum/${courseId}`} className="ms-auto">
                  Create New Forum
                </Button>
              )}
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="shadow-sm no-border-bg">
              <Card.Body>
                <ListGroup variant="flush">
                  {Array.isArray(forums) && forums.length > 0 ? (
                    forums.map((forum) => (
                      <ListGroup.Item
                        key={forum.ForumID}
                        className="mb-3 shadow-sm rounded-4 p-4"
                      >
                        <h5>{forum.Subject}</h5>
                        <p className="text-muted">
                          {new Date(forum.DateCreated).toLocaleString()}
                        </p>
                        <Button
                          variant="outline-primary"
                          href={`/forums/${forum.ForumID}/threads`}
                          className="btn-set"
                        >
                          View Threads
                        </Button>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <Alert className="text-center text-muted mb-0">
                      <FaInfoCircle/>No forums available.
                    </Alert>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CourseForums;
