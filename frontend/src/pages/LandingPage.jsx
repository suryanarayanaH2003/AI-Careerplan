import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [resume, setResume] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('job_role', jobRole);

    try {
      const response = await axios.post('http://localhost:8000/api/profile-interpret/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/career-path', { state: { careerPath: response.data.data } });
    } catch (error) {
      console.error('Error uploading resume:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-indigo-800 mb-4">Career Path Planner</h1>
        <p className="text-lg text-indigo-600">Plan your career path by refining your strengths and skills.</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg transform transition duration-500 hover:scale-105">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resume">
            Upload Your Resume
          </label>
          <input
            type="file"
            id="resume"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobRole">
            Job Role
          </label>
          <input
            type="text"
            id="jobRole"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your desired job role"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Generate Career Path
        </button>
      </form>
    </div>
  );
};

export default LandingPage;
