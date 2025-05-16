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
import axios from "axios";
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
        setError(err.data?.message || "Error fetching forums");
      }
    };
    fetchForums();
  }, [courseId]);

  return (
    <>
      <div className="container mt-4">
        <Button variant="primary" className="mb-3" onClick={() => navigate(-1)}>
          ⬅️ Back
        </Button>
      </div>
      <Container className="mt-5">
        <Row>
          <Col md={8} className="mx-auto">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="text-center mb-4">Course Forums</h3>

              {error && <Alert variant="danger">{error}</Alert>}

              {role != "student" && (
                <Button href={`/create-forum/${courseId}`} className="mb-3">
                  {" "}
                  Create New Forum{" "}
                </Button>
              )}
            </div>

            <Card className="shadow-sm">
              <Card.Body>
                <ListGroup variant="flush">
                  {forums.map((forum) => (
                    <ListGroup.Item
                      key={forum.ForumID}
                      className="mb-3 shadow-sm"
                    >
                      <h5>{forum.Subject}</h5>
                      <p className="text-muted">
                        {new Date(forum.DateCreated).toLocaleString()}
                      </p>
                      <Button
                        variant="outline-primary"
                        href={`/forums/${forum.ForumID}/threads`}
                        className="w-100"
                      >
                        View Threads
                      </Button>
                    </ListGroup.Item>
                  ))}
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
