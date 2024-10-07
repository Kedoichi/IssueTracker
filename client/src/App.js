import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/issues';

function App() {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Data received:', data);
      setIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Issues Tracker</h1>
      
      {error && <p className="text-red-500">Error: {error}</p>}
      
      <ul className="space-y-4">
        {issues.length === 0 ? (
          <li>No issues found</li>
        ) : (
          issues.map(issue => (
            <li key={issue.id} className="border rounded p-4">
              <h3 className="font-bold">{issue.title}</h3>
              <p>{issue.description}</p>
              <p>Status: {issue.status}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;