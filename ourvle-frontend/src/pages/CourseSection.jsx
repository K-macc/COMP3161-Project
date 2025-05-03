import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, Alert } from 'react-bootstrap';
import axios from 'axios';

const SectionContent = () => {
  const { sectionId } = useParams();
  const [content, setContent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSectionContent = async () => {
      try {
        const response = await axios.get(`/section/${sectionId}/content`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setContent(response.data);
        setError('');
      } catch (err) {
        setContent(null);
        setError(
          err.response?.data?.message || 'Error fetching section content'
        );
      }
    };

    fetchSectionContent();
  }, [sectionId]);

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>Section Content</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {content && (
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Lecture Slides:</strong>
                <div>{content.LectureSlides || 'No slides available'}</div>
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Files:</strong>
                <div>{content.Files || 'No files available'}</div>
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Links:</strong>
                <div>{content.Links || 'No links available'}</div>
              </ListGroup.Item>
            </ListGroup>
          )}

          {!error && !content && <p>Loading content...</p>}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SectionContent;
