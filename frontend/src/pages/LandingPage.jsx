"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  { id: 1, title: "Extracting Resume Content", description: "Reading and parsing your PDF resume..." },
  { id: 2, title: "Analyzing Skills", description: "Identifying your current skills and experience..." },
  { id: 3, title: "Market Research", description: "Researching current job market trends..." },
  { id: 4, title: "Generating Career Plan", description: "Creating your personalized career roadmap..." },
];

export default function CareerPlannerHome() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid PDF file");
    }
  };

  const simulateProgress = () => {
    let step = 0;
    let progressValue = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        setCurrentStep(step);
        progressValue += 25;
        setProgress(progressValue);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 3000); // Adjust based on backend processing time
    return interval;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobRole.trim()) {
      setError("Please provide both resume file and job role");
      return;
    }
    setIsLoading(true);
    setError("");
    setCurrentStep(0);
    setProgress(0);
    const progressInterval = simulateProgress();
    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("job_role", jobRole);
      const response = await fetch("http://127.0.0.1:8000/api/profile-interpret/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Failed to process resume: ${response.status}`);
      }
      const result = await response.json();
      console.log("API Response:", result); // Debug log
      if (!result.id) {
        throw new Error("No profile ID returned from API");
      }
      clearInterval(progressInterval);
      setProgress(100);
      setCurrentStep(steps.length);
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/career-plan/${result.id}`);
      }, 1000);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || "An error occurred while processing your resume");
      setIsLoading(false);
      setProgress(0);
      setCurrentStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900">AI Career Planner</h1>
          <p className="text-lg text-gray-600 mt-2 max-w-md mx-auto">
            Upload your resume and target job role to unlock a personalized career roadmap
          </p>
        </div>
        <div className="bg-white/90 rounded-lg shadow-md p-6">
          {!isLoading ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="resume" className="text-sm font-medium text-gray-700">
                  Upload Resume (PDF)
                </label>
                <div className="relative">
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {file && (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {file.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="jobRole" className="text-sm font-medium text-gray-700">
                  Target Job Role
                </label>
                <input
                  id="jobRole"
                  type="text"
                  placeholder="e.g., Gen AI, Full Stack Developer, Data Scientist"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {error && (
                <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded-md">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={!file || !jobRole.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-md font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Career Plan
              </button>
            </form>
          ) : (
            <div className="space-y-6 py-8">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Processing your resume...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-500 transform ${
                        isActive
                          ? "border-blue-200 bg-blue-50 scale-105"
                          : isCompleted
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full ${
                          isActive ? "bg-blue-100 text-blue-600" : isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          {step.id === 1 && (
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 20V4h7v5h5v11H6z" />
                          )}
                          {step.id === 2 && (
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z" />
                          )}
                          {step.id === 3 && (
                            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 11H9v2h2v2h2v-2h2V9h-2V7h-2v2zm0 4h-2v2h2v-2z" />
                          )}
                          {step.id === 4 && (
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          )}
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            isActive ? "text-blue-700" : isCompleted ? "text-green-700" : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                      {isCompleted && (
                        <div className="text-green-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}