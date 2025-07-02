"use client";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  { id: 1, title: "Extracting Resume Content", description: "Reading and parsing your PDF resume..." },
  { id: 2, title: "Analyzing Skills", description: "Identifying your current skills and experience..." },
  { id: 3, title: "Market Research", description: "Researching current job market trends..." },
  { id: 4, title: "Generating Career Plan", description: "Creating your personalized career roadmap..." },
];

export default function EnhancedCareerPlannerHome() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid PDF file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
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
    }, 3000);
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
      console.log("API Response:", result);
      if (!result.id) {
        throw new Error("No profile ID returned from API");
      }
      clearInterval(progressInterval);
      setProgress(100);
      setCurrentStep(steps.length);
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/career-path/${result.id}`);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-800">
              AI Career Planner
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Advance your career with AI-driven insights. Upload your resume and get a personalized roadmap to achieve your professional goals.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {!isLoading ? (
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* File Upload Section */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-slate-800 flex items-center gap-3">
                    <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    Upload Resume (PDF)
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                      isDragOver
                        ? "border-slate-400 bg-slate-50"
                        : file
                        ? "border-green-500 bg-green-50"
                        : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      {file ? (
                        <div className="space-y-3">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <p className="text-green-700 font-semibold text-lg">{file.name}</p>
                          <p className="text-slate-600">File uploaded successfully</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full">
                            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                          </div>
                          <p className="text-slate-800 font-semibold text-lg">
                            {isDragOver ? "Drop your PDF here" : "Drag & drop your PDF resume"}
                          </p>
                          <p className="text-slate-500">or click to browse files</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Job Role Input */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-slate-800 flex items-center gap-3">
                    <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                        />
                      </svg>
                    </div>
                    Target Job Role
                  </label>
                  <input
                    id="jobRole"
                    type="text"
                    placeholder="e.g., Gen AI Engineer, Full Stack Developer, Data Scientist"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-300 text-lg"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-6 h-6 text-red-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!file || !jobRole.trim()}
                  className="w-full bg-slate-800 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800 flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate My Career Plan
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-slate-50 p-8 md:p-12">
              <div className="space-y-8">
                {/* Progress Header */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full">
                    <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Processing Your Career Data</h2>
                  <p className="text-slate-600">Our AI is analyzing your profile and market trends...</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span className="font-medium">Overall Progress</span>
                    <span className="font-bold">{progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-800 transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Steps */}
                <div className="grid gap-4">
                  {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-6 p-6 rounded-xl border-2 transition-all duration-700 ${
                          isActive
                            ? "border-slate-300 bg-white shadow-md"
                            : isCompleted
                            ? "border-green-200 bg-green-50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ${
                            isActive
                              ? "bg-slate-800 text-white"
                              : isCompleted
                              ? "bg-green-600 text-white"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isCompleted ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="font-bold">{step.id}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-bold text-lg transition-colors duration-500 ${
                              isActive ? "text-slate-800" : isCompleted ? "text-green-800" : "text-slate-600"
                            }`}
                          >
                            {step.title}
                          </h3>
                          <p
                            className={`text-sm transition-colors duration-500 ${
                              isActive ? "text-slate-600" : isCompleted ? "text-green-600" : "text-slate-500"
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>
                        {isActive && (
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce animation-delay-200"></div>
                            <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce animation-delay-400"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}
