import React, { useState } from 'react';
import axios from 'axios';

function CreateAssignment({ courseId }) {
  const [assignmentName, setAssignmentName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('assignment_name', assignmentName);
    formData.append('due_date', dueDate);
    formData.append('file', file);
    formData.append('link', link);

    try {
      const response = await axios.post(`/course/${courseId}/create_assignment`, formData, {
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
      <h2>Create Assignment for Course {courseId}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Assignment Name:
            <input type="text" value={assignmentName} onChange={(e) => setAssignmentName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Due Date:
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Upload File:
            <input type="file" onChange={handleFileChange} />
          </label>
        </div>
        <div>
          <label>
            Assignment Link:
            <input type="text" value={link} onChange={(e) => setLink(e.target.value)} />
          </label>
        </div>
        <button type="submit">Create Assignment</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateAssignment;
