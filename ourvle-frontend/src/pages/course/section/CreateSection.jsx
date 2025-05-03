import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SectionContent({ sectionId }) {
  const [content, setContent] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`/section/${sectionId}/content`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setContent(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || 'An error occurred');
      }
    };

    fetchContent();
  }, [sectionId]);

  return (
    <div>
      <h2>Section {sectionId} Content</h2>
      {message && <p>{message}</p>}
      {!message && (
        <div>
          {content.LectureSlides && <p>Slides: <a href={content.LectureSlides} target="_blank" rel="noopener noreferrer">View</a></p>}
          {content.Files && <p>Files: <a href={content.Files} target="_blank" rel="noopener noreferrer">Download</a></p>}
          {content.Links && <p>Links: <a href={content.Links} target="_blank" rel="noopener noreferrer">Open</a></p>}
        </div>
      )}
    </div>
  );
}

export default SectionContent;
