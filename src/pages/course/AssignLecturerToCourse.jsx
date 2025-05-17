import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
  Form,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserTie, FaLongArrowAltLeft } from "react-icons/fa";
import useAuthFetch from "@/context/AuthFetch";

function AssignLecturer() {
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturerId, setSelectedLecturerId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const authFetch = useAuthFetch();
  const { courseId } = useParams();
  const navigate = useNavigate();

  const fetchLecturers = async () => {
    try {
      const response = await authFetch("/api/lecturers");
      const data = await response.json();
      setLecturers(data);
    } catch (error) {
      setMessageType("danger");
      setMessage("Failed to fetch lecturers!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  const assignLecturer = async () => {
    setMessage("");
    setMessageType("");
    try {
      const response = await authFetch(
        `/api/courses/${courseId}/assign-lecturer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ LecturerID: selectedLecturerId }),
        }
      );

      const data = await response.json();

      if (response.status !== 201) {
        setMessageType("danger");
      } else {
        setMessageType("success");
        setSelectedLecturerId("");
        setTimeout(() => navigate(`/courses/${courseId}`), 5000);
      }
      setMessage(data.message);
    } catch (error) {
      setMessageType("danger");
      setMessage("Failed to assign lecturer!");
    }
  };

  return (
    <Container className="mt-5">
      <div className="container mt-4">
        <Button
          variant="primary"
          className="mb-3 d-flex align-items-center"
          onClick={() => navigate(`/courses/${courseId}`)}
        >
          <FaLongArrowAltLeft className="me-2" />
          Back
        </Button>
      </div>
      <h2 className="mb-4 text-center">Assign Lecturer to Course</h2>

      {message && (
        <Alert
          variant={messageType === "success" ? "success" : "danger"}
          className="fade-alert position-absolute top-0 end-0 m-3"
        >
          {message}
        </Alert>
      )}

      {loading ? (
        <div className="d-flex justify-content-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-center mb-4">
            <div className="w-100" style={{ maxWidth: "300px" }}>
              <Form.Group>
                <Form.Label className="text-center w-100">
                  <h5>Selected Lecturer ID</h5>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={selectedLecturerId}
                  readOnly
                  placeholder="No lecturer selected"
                />
              </Form.Group>
            </div>
          </div>

          <div className="d-flex justify-content-center mb-5">
            <Button
              type="submit"
              variant="primary"
              onClick={assignLecturer}
              disabled={!selectedLecturerId}
              className="w-auto px-4"
            >
              <FaUserTie className="me-2" />
              Assign Lecturer to Course
            </Button>
          </div>

          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {lecturers.map((lect) => (
              <Col key={lect.LecturerID}>
                <Card
                  className={`h-100 shadow-sm rounded-4 card-info ${
                    selectedLecturerId === lect.LecturerID
                      ? "border border-success border-2"
                      : ""
                  }`}
                >
                  <Card.Body className="p-4 d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title className="text-primary fs-5 fw-bold mb-2">
                        {lect.LecturerName}
                      </Card.Title>
                      <Card.Text className="text-muted mb-1">
                        <i className="bi bi-envelope me-2 text-secondary"></i>
                        {lect.Email}
                      </Card.Text>
                      <Card.Text>
                        <span className="badge bg-success">
                          ID: {lect.LecturerID}
                        </span>
                      </Card.Text>
                    </div>
                    <Button
                      variant={
                        selectedLecturerId === lect.LecturerID
                          ? "outline-dark"
                          : "outline-primary"
                      }
                      onClick={() =>
                        setSelectedLecturerId((prev) =>
                          prev === lect.LecturerID ? "" : lect.LecturerID
                        )
                      }
                      className="w-100 fw-semibold rounded-pill mt-3"
                    >
                      {selectedLecturerId === lect.LecturerID
                        ? "Selected"
                        : "Select"}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}

export default AssignLecturer;
