import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa"; 
import axios from "axios";
import useAuthFetch from "@/context/AuthFetch";

const CourseMembers = () => {
  const { courseId } = useParams();
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchCourseMembers = async () => {
      setLoading(true);
      try {
        const response = await authFetch(`/api/course_members/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setMembers(data.members);
      } catch (err) {
        setError(err.data?.message || "Error fetching members");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseMembers();
  }, [courseId]);

  return (
    <>
      <div className="container mt-4">
        <Button variant="primary" className="mb-3" onClick={() => navigate(-1)}>
          ⬅️ Back
        </Button>
      </div>
      <div className="container mt-4">
        <h3>Course Members</h3>

        
        {error && <Alert variant="danger">{error}</Alert>}

        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {members.map((member) => (
            <Col key={member.StudentID}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      backgroundColor: "#007bff",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "40px",
                    }}
                  >
                    <FaUserCircle size={50} />
                  </div>
                  <Card.Title className="mt-3">{member.StudentName}</Card.Title>
                  <Button variant="outline-primary" className="mt-2">
                    View Profile
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* If there are no members */}
        {!loading && members.length === 0 && !error && (
          <Alert variant="info">No members found for this course.</Alert>
        )}

        {loading && (
          <div className="spinner-container">
            <Spinner animation="border" variant="primary" className="spinner" />
          </div>
        )}
      </div>
    </>
  );
};

export default CourseMembers;
