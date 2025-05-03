import React, { useState } from 'react';
import axios from 'axios';

function SubmitAssignment({ assignmentId }) {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [contentType, setContentType] = useState('');
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
      const response = await axios.post(`/assignments/${assignmentId}/submit`, formData, {
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
      <h2>Submit Assignment {assignmentId}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Content Type:
            <select value={contentType} onChange={(e) => setContentType(e.target.value)}>
              <option value="file">File</option>
              <option value="link">Link</option>
            </select>
          </label>
        </div>
        {contentType === 'file' && (
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
              Assignment Link:
              <input type="text" value={link} onChange={(e) => setLink(e.target.value)} />
            </label>
          </div>
        )}
        <button type="submit">Submit Assignment</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SubmitAssignment;
