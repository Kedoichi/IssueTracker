import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/issues';

function App() {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ title: '', description: '', status: 'Open' });
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
      setIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError(error.message);
    }
  };

  const createIssue = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIssue),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdIssue = await response.json();
      setIssues([...issues, createdIssue]);
      setNewIssue({ title: '', description: '', status: 'Open' });
    } catch (error) {
      console.error('Error creating issue:', error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2e3c9]"> {/* Light beige background */}
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6 text-center text-[#0b6472]">Issues Tracker</h1> {/* Teal text */}
        
        {error && (
          <div className="bg-[#f26526] text-white px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        
        <div className="mb-6 bg-white shadow-md rounded px-8 pt-6 pb-8">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Title"
              value={newIssue.title}
              onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Description"
              value={newIssue.description}
              onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
            />
          </div>
          <div className="mb-4">
            <select
              value={newIssue.status}
              onChange={(e) => setNewIssue({...newIssue, status: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <button 
            onClick={createIssue}
            className="bg-[#0b6472] hover:bg-[#094a55] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          >
            <PlusCircle className="mr-2" size={18} />
            Create Issue
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues.map(issue => (
            <div key={issue._id} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border-t-4 border-[#0b6472]">
              <h3 className="font-bold text-xl mb-2 text-[#0b6472]">{issue.title}</h3>
              <p className="text-gray-700 text-base mb-4">{issue.description}</p>
              <p className="text-sm text-[#f26526] mb-4 font-semibold">Status: {issue.status}</p>
              <div className="flex justify-end">
                <button className="bg-[#f2a444] hover:bg-[#e09333] text-white font-bold py-2 px-4 rounded mr-2">
                  <Edit2 size={18} />
                </button>
                <button className="bg-[#f26526] hover:bg-[#e15415] text-white font-bold py-2 px-4 rounded">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;