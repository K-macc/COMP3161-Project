import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Offcanvas, ListGroup, Alert } from "react-bootstrap";
import useAuthFetch from "@/context/AuthFetch";
import {
  FaBook,
  FaInfoCircle,
  FaFilePowerpoint,
  FaFile,
  FaLink,
  FaBars,
} from "react-icons/fa";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [sectionContent, setSectionContent] = useState(null);
  const [sectionError, setSectionError] = useState("");
  const role = localStorage.getItem("role");
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchCourse = async () => {
      if (localStorage.getItem("CourseID")) {
        localStorage.removeItem("CourseID");
      }
      localStorage.setItem("CourseID", courseId);
      try {
        const response = await authFetch(`/api/get_course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.data?.message || "Error fetching course");
      }
    };

    const fetchSectionContent = async () => {
      try {
        const response = await authFetch(`/api/section/${courseId}/content`);
        const data = await response.json();
        setSectionContent(data);
        setSectionError("");
      } catch (err) {
        setSectionContent(null);
        setSectionError(err.data?.message || "Error fetching section content");
      }
    };

    fetchCourse();
    fetchSectionContent();
  }, [courseId]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Course Details</h2>
        <Button
          variant="primary"
          onClick={() => setShowSidebar(true)}
          className="d-flex align-items-center"
        >
          <FaBars
            className="me-2"
            style={{ fontSize: "20px", color: "white" }}
          />
          Open Menu
        </Button>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {course && (
        <Card className="mt-4 shadow-sm border-0 rounded">
          <Card.Header className="bg-info text-white d-flex align-items-center">
            <FaBook className="me-2" />
            <h5 className="mb-0">{course.CourseName}</h5>
          </Card.Header>
          <Card.Body className="bg-light">
            <div className="row">
              <div className="col-md-6 mb-2">
                <strong>Course ID:</strong>
                <span className="ms-2">{course.CourseID}</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      <div className="mt-4">
        <h4 className="text-white">Course Content</h4>
        <Card className="bg-transparent border-0">
          <Card.Body>
            {sectionError && <Alert variant="danger">{sectionError}</Alert>}
            {sectionContent && sectionContent.length > 0
              ? sectionContent.map((section, index) => (
                  <Card key={index} className="mb-4 shadow-sm border-0">
                    <Card.Header
                      className="bg-primary text-white"
                      style={{ fontWeight: "bold" }}
                    >
                      Section {index + 1}
                    </Card.Header>
                    <Card.Body>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <strong className="d-flex align-items-center">
                            <FaFilePowerpoint
                              className="me-1"
                              style={{ color: "orange", fontSize: "16px" }}
                            />
                            Lecture Slides:
                          </strong>
                          <div className="ms-3 mt-1 text-break">
                            {section.LectureSlides ? (
                              <a
                                href={section.LectureSlides}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {section.LectureSlides}
                              </a>
                            ) : (
                              <span className="text-muted">
                                No slides available
                              </span>
                            )}
                          </div>
                        </ListGroup.Item>

                        <ListGroup.Item>
                          <strong className="d-flex align-items-center">
                            <FaFile
                              className="me-1"
                              style={{ color: "#f9a602", fontSize: "16px" }}
                            />
                            Files:
                          </strong>
                          <div className="ms-3 mt-1 text-break">
                            {section.Files ? (
                              <a
                                href={section.Files}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {section.Files}
                              </a>
                            ) : (
                              <span className="text-muted">
                                No files available
                              </span>
                            )}
                          </div>
                        </ListGroup.Item>

                        <ListGroup.Item>
                          <strong className="d-flex align-items-center">
                            <FaLink
                              className="me-1"
                              style={{ color: "#0078d7", fontSize: "16px" }}
                            />
                            Links:
                          </strong>
                          <div className="ms-3 mt-1 text-break">
                            {section.Links ? (
                              <a
                                href={section.Links}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {section.Links}
                              </a>
                            ) : (
                              <span className="text-muted">
                                No links available
                              </span>
                            )}
                          </div>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Card>
                ))
              : !sectionError && (
                  <Alert variant="info" className="text-muted">
                    <FaInfoCircle /> No section content found.
                  </Alert>
                )}
          </Card.Body>
        </Card>
      </div>

      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Course Options</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex align-items-center flex-column">
          {role == "student" && (
            <>
              <Button
                variant="primary"
                className="mb-2 w-75"
                href={`/get-forums/${courseId}`}
              >
                View Forums
              </Button>
              <Button
                variant="primary"
                className="mb-2 w-75"
                href={`/get-assignments/${courseId}`}
              >
                View Assignments
              </Button>
            </>
          )}
          {role == "lecturer" && (
            <>
              <Button
                variant="primary"
                className="mb-2 w-75"
                href={`/course-members/${courseId}`}
              >
                Get Members
              </Button>

              <Button
                variant="primary"
                className="mb-2 w-75"
                href={`/get-forums/${courseId}`}
              >
                View Forums
              </Button>

              <Button
                variant="primary"
                className="mb-2 w-75"
                href={`/get-events/${courseId}`}
              >
                View Events
              </Button>

              <Button
                variant="primary"
                className="mb-2 w-75"
                href={`/get-assignments/${courseId}`}
              >
                View Assignments
              </Button>

              <Button
                variant="primary"
                className="mb-2 w-75"
                href={`/create-section/${courseId}`}
              >
                Add A New Section
              </Button>

              <Button
                variant="primary"
                className="mb-2 w-75"
                href={`/create-assignment/${courseId}`}
              >
                Create Assignment
              </Button>
            </>
          )}
          {role == "admin" && (
            <>
              <Button
                variant="primary"
                className="mb-2 w-75"
                href={`/course-members/${courseId}`}
              >
                Get Members
              </Button>

              <Button
                variant="primary"
                className="mb-2 w-75"
                href={`/get-forums/${courseId}`}
              >
                View Forums
              </Button>

              <Button
                variant="primary"
                className="mb-2 w-75"
                href={`/get-events/${courseId}`}
              >
                View Events
              </Button>

              <Button
                variant="primary"
                className="mb-2 w-75"
                href={`/get-assignments/${courseId}`}
              >
                View Assignments
              </Button>

              <Button
                variant="primary"
                className="mb-2 w-75"
                href={`/assign-lecturer/${courseId}`}
              >
                Assign Lecturer
              </Button>
              
              <Button
                variant="primary"
                className="mb-2 w-75"
                href={`/create-section/${courseId}`}
              >
                Add A New Section
              </Button>
              
              <Button
                variant="primary"
                className="mb-2 w-75"
                href={`/create-assignment/${courseId}`}
              >
                Create Assignment
              </Button>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default CourseDetail;
