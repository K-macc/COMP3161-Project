import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FinalAverage({ studentId }) {
  const [finalAverage, setFinalAverage] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchFinalAverage = async () => {
      try {
        const response = await axios.get(`/students/${studentId}/final_average`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFinalAverage(response.data.final_average);
      } catch (error) {
        setMessage(error.response?.data?.message || 'An error occurred');
      }
    };

    fetchFinalAverage();
  }, [studentId]);

  return (
    <div>
      <h2>Final Average for Student {studentId}</h2>
      {message && <p>{message}</p>}
      {!message && <p>{finalAverage !== null ? `Your final average is: ${finalAverage}` : 'No grades found'}</p>}
    </div>
  );
}

export default FinalAverage;
