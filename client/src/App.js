import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, X } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/issues';

function App() {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ title: '', description: '', status: 'Open' });
  const [editingIssue, setEditingIssue] = useState(null);
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

  const updateIssue = async (id, updatedIssue) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedIssue),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updated = await response.json();
      setIssues(issues.map(issue => issue._id === id ? updated : issue));
      setEditingIssue(null);
    } catch (error) {
      console.error('Error updating issue:', error);
      setError(error.message);
    }
  };

  const deleteIssue = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setIssues(issues.filter(issue => issue._id !== id));
    } catch (error) {
      console.error('Error deleting issue:', error);
      setError(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-500';
      case 'In Progress':
        return 'bg-green-500';
      case 'Closed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#f2e3c9]">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6 text-center text-[#0b6472]">Issues Tracker</h1>
        
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
            <div key={issue._id} className="bg-white shadow-md rounded overflow-hidden">
              <div className={`${getStatusColor(issue.status)} text-white text-center py-2 font-bold`}>
                {issue.status}
              </div>
              <div className="px-6 py-4">
                {editingIssue === issue._id ? (
                  <div>
                    <input
                      type="text"
                      value={issue.title}
                      onChange={(e) => setIssues(issues.map(i => i._id === issue._id ? {...i, title: e.target.value} : i))}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    />
                    <textarea
                      value={issue.description}
                      onChange={(e) => setIssues(issues.map(i => i._id === issue._id ? {...i, description: e.target.value} : i))}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 mb-2"
                    />
                    <select
                      value={issue.status}
                      onChange={(e) => setIssues(issues.map(i => i._id === issue._id ? {...i, status: e.target.value} : i))}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <div className="flex justify-end">
                      <button
                        onClick={() => updateIssue(issue._id, issue)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingIssue(null)}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-xl mb-2 text-[#0b6472]">{issue.title}</h3>
                    <p className="text-gray-700 text-base mb-4">{issue.description}</p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setEditingIssue(issue._id)}
                        className="bg-[#f2a444] hover:bg-[#e09333] text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteIssue(issue._id)}
                        className="bg-[#f26526] hover:bg-[#e15415] text-white font-bold py-2 px-4 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;