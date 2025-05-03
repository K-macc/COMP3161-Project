import React, { useState } from 'react';
import axios from 'axios';

function GradeAssignment({ assignmentId, studentId }) {
  const [grade, setGrade] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (grade < 0 || grade > 100) {
      return setMessage('Grade must be between 0 and 100');
    }

    try {
      const response = await axios.post(`/assignments/${assignmentId}/${studentId}/grade`, { grade }, {
        headers: {
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
      <h2>Grade Assignment {assignmentId} for Student {studentId}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Grade:
            <input type="number" value={grade} onChange={(e) => setGrade(e.target.value)} />
          </label>
        </div>
        <button type="submit">Submit Grade</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default GradeAssignment;
