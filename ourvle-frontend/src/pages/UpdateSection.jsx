import React, { useState } from 'react';
import axios from 'axios';

function UploadSectionContent({ sectionId }) {
  const [file, setFile] = useState(null);
  const [contentType, setContentType] = useState('');
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content_type', contentType);
    formData.append('file', file);
    formData.append('link', link);

    try {
      const response = await axios.post(`/section/${sectionId}/content`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div>
      <h2>Upload Content for Section {sectionId}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Content Type:
            <select value={contentType} onChange={(e) => setContentType(e.target.value)}>
              <option value="slides">Slides</option>
              <option value="file">File</option>
              <option value="link">Link</option>
            </select>
          </label>
        </div>
        {contentType !== 'link' && (
          <div>
            <label>
              Upload File:
              <input type="file" onChange={handleFileChange} />
            </label>
          </div>
        )}
        {contentType === 'link' && (
          <div>
            <label>
              Content Link:
              <input type="text" value={link} onChange={(e) => setLink(e.target.value)} />
            </label>
          </div>
        )}
        <button type="submit">Upload Content</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadSectionContent;
