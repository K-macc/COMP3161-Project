import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Offcanvas, ListGroup, Alert } from "react-bootstrap";
import axios from "axios";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [sectionContent, setSectionContent] = useState(null);
  const [sectionError, setSectionError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/get_course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCourse(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching course");
      }
    };

    const fetchSectionContent = async () => {
      try {
        const response = await axios.get(`/api/section/${courseId}/content`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSectionContent(response.data);
        setSectionError("");
      } catch (err) {
        setSectionContent(null);
        setSectionError(
          err.response?.data?.message || "Error fetching section content"
        );
      }
    };

    fetchCourse();
    fetchSectionContent();
  }, [courseId]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h3>Course Details</h3>
        <Button variant="primary" onClick={() => setShowSidebar(true)}>
          Open Menu
        </Button>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {course && (
        <Card className="mt-4 shadow-sm border-0 rounded">
          <Card.Header className="bg-info text-white d-flex align-items-center">
            <span role="img" aria-label="book" className="me-2">
              📘
            </span>
            <h5 className="mb-0">{course.CourseName}</h5>
          </Card.Header>
          <Card.Body className="bg-light">
            <div className="row">
              <div className="col-md-6 mb-2">
                <strong>Course ID:</strong>{" "}
                <span className="ms-2">{course.CourseID}</span>
              </div>
              {/* You can add more fields here like Instructor, Credits, etc. */}
            </div>
          </Card.Body>
        </Card>
      )}

      <div className="mt-4">
        <h4>Course Content</h4>
        <Card>
          <Card.Body>
            {sectionError && <Alert variant="danger">{sectionError}</Alert>}
            {sectionContent && sectionContent.length > 0
              ? sectionContent.map((section, index) => (
                  <Card key={index} className="mb-4 shadow-sm border-0">
                    <Card.Header className="bg-primary text-white">
                      Section {index + 1}
                    </Card.Header>
                    <Card.Body>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <strong>📚 Lecture Slides:</strong>
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
                          <strong>📁 Files:</strong>
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
                          <strong>🔗 Links:</strong>
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
                  <p className="text-muted">No section content found.</p>
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
        <Offcanvas.Body>
          <Button variant="primary" className="mb-2 w-100" href={`/course-members/${courseId}`}> Get Members </Button>
          <Button variant="primary" className="mb-2 w-100" href={`/get-forums/${courseId}`}> View Forums </Button>
          <Button variant="primary" className="mb-2 w-100" href={`/create-section/${courseId}`}> Add A New Section </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default CourseDetail;
