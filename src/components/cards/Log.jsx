import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserLogViewer = ({ requestId }) => {
  const [userLog, setUserLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserLog = async () => {
      try {

        const response = await axios.get(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.${requestId}`);
        setUserLog(response.data);
      } catch (error) {
        console.error('Error fetching user log:', error);
        setError('Error fetching user log');
      } finally {
        setLoading(false);
      }
    };

    fetchUserLog();
  }, [requestId]); // Include request.id in the dependency array to trigger the effect on its change

  return (
<div>
  {loading ? (
    <p>Loading user log...</p>
  ) : error ? (
    <p>{error}</p>
  ) : (
    <div>
      <ul>
        {userLog.map((logEntry) => (
          <li key={logEntry.id}>
            {/* Display log entry details with labels */}
            <p><strong>Visitor Name:</strong> {logEntry.visitorname}</p>
            <p><strong>Visitor Phone:</strong> {logEntry.visitorphone}</p>
            <p><strong>Visitor Email:</strong> {logEntry.visitoremail}</p>
            <p><strong>Arrival Time:</strong> {logEntry.plannedvisittime}</p>
            <p><strong>Host Name:</strong> {logEntry.hostname}</p>
            <p><strong>Host Decision:</strong> {logEntry.status}</p>
            <p><strong>Visitor's Status:</strong> {logEntry.statusbystaffid}</p>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

  );
};

export default UserLogViewer;
