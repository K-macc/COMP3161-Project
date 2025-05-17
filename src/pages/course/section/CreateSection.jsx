import React, { useState, useRef } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import useAuthFetch from "@/context/AuthFetch";
import { useNavigate } from "react-router-dom";
import { FaBookOpen, FaFolder, FaLongArrowAltLeft } from "react-icons/fa";

function CreateSectionContent() {
  const [slides, setSlides] = useState(null);
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { courseId } = useParams();
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const slidesInputRef = useRef();
  const fileInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const formData = new FormData();
    if (slides) formData.append("slides", slides);
    if (file) formData.append("file", file);
    formData.append("link", link);

    try {
      const response = await authFetch(`/api/section/${courseId}/content`, {
        body: formData,
        method: "POST",
      });
      const data = await response.json();
      if (response.status !== 201) {
        setMessageType("danger");
      } else {
        setMessageType("success");
        setSlides(null);
        setFile(null);
        setLink("");
        if (slidesInputRef.current) {
          slidesInputRef.current.value = "";
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setTimeout(() => {
          navigate(`/courses/${courseId}`);
        }, 5000);
      }
      setMessage(data.message);
    } catch (err) {
      setMessageType("danger");
      setMessage("Upload failed!");
    }
  };

  return (
    <div className="container mt-4">
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
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-success text-white">
          <h4 className="mb-0">
            <FaBookOpen /> Create New Section
          </h4>
        </Card.Header>
        <Card.Body className="bg-light">
          {message && (
            <Alert
              variant={messageType === "success" ? "success" : "danger"}
              className="fade-alert position-absolute top-0 end-0 m-3"
            >
              {message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group controlId="slidesUpload" className="mb-3">
              <Form.Label>
                <strong>Lecture Slides (PDF/PPT)</strong>
              </Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={(e) => setSlides(e.target.files[0])}
                ref={slidesInputRef}
              />
            </Form.Group>

            <Form.Group controlId="fileUpload" className="mb-3">
              <Form.Label>
                <strong>Additional File</strong>
              </Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                ref={fileInputRef}
              />
            </Form.Group>

            <Form.Group controlId="sectionLink" className="mb-4">
              <Form.Label>
                <strong>External Link</strong>
              </Form.Label>
              <Form.Control
                type="url"
                placeholder="https://example.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Form.Group>

            <div className="text-end">
              <Button type="submit" variant="primary">
                <FaFolder /> Create Section
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CreateSectionContent;
