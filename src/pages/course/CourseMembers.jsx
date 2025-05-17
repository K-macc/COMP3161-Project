import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import { FaUserCircle, FaLongArrowAltLeft, FaInfoCircle } from "react-icons/fa";
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
        <h2>Course Members</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {members && members.length > 0 ? (
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
                    <Card.Title className="mt-3">
                      {member.StudentName}
                    </Card.Title>
                    <Button variant="outline-primary" className="mt-2">
                      View Profile
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          !loading && (
            <Alert variant="info"><FaInfoCircle/> No members found for this course.</Alert>
          )
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
