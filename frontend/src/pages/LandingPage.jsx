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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-50 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-50 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      <div className="max-w-4xl w-full relative z-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 className="inline text-5xl font-bold bg-gradient-to-r from-blue-400 via-blue-400 to-pink-400 bg-clip-text text-transparent align-middle">
              AI Career Planner
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transform your career journey with AI-powered insights. Upload your resume and discover your personalized
            roadmap to success.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
          {!isLoading ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* File Upload Section */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-white flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Upload Resume (PDF)
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                    isDragOver
                      ? "border-blue-400 bg-blue-500/10 scale-105"
                      : file
                      ? "border-green-400 bg-green-500/10"
                      : "border-gray-400 bg-white/5 hover:border-blue-400 hover:bg-blue-500/5"
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
                    className="absolute inset-0 w-full h-8px opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    {file ? (
                      <div className="space-y-3">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full">
                          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-green-400 font-semibold text-lg">{file.name}</p>
                        <p className="text-gray-400">File uploaded successfully!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full">
                          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <p className="text-white font-semibold text-lg">
                          {isDragOver ? "Drop your PDF here" : "Drag & drop your PDF resume"}
                        </p>
                        <p className="text-gray-400">or click to browse files</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Job Role Input */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-white flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  </svg>
                  Target Job Role
                </label>
                <div className="relative">
                  <input
                    id="jobRole"
                    type="text"
                    placeholder="e.g., Gen AI Engineer, Full Stack Developer, Data Scientist"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg backdrop-blur-sm"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  </div>
                </div>
              </div>
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-red-400 flex-shrink-0"
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
                    <p className="text-red-300 font-medium">{error}</p>
                  </div>
                </div>
              )}
              {/* Submit Button */}
              <button
                type="submit"
                disabled={!file || !jobRole.trim()}
                className="w-full bg-gradient-to-r from-blue-500 via-blue-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:via-blue-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-2xl disabled:hover:scale-100 disabled:hover:shadow-none relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate My Career Plan
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          ) : (
            <div className="space-y-8 py-8">
              {/* Progress Header */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-spin">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Processing Your Career Data</h2>
                <p className="text-gray-300">Our AI is analyzing your profile and market trends...</p>
              </div>
              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-300">
                  <span className="font-medium">Overall Progress</span>
                  <span className="font-bold">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-blue-500 to-pink-500 transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
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
                      className={`flex items-center gap-6 p-6 rounded-2xl border-2 transition-all duration-700 transform ${
                        isActive
                          ? "border-blue-400/50 bg-blue-500/10 scale-105 shadow-lg shadow-blue-500/25"
                          : isCompleted
                          ? "border-green-400/50 bg-green-500/10 shadow-lg shadow-green-500/25"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ${
                          isActive
                            ? "bg-blue-500 text-white animate-pulse"
                            : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-white/10 text-gray-400"
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
                            isActive ? "text-blue-300" : isCompleted ? "text-green-300" : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`text-sm transition-colors duration-500 ${
                            isActive ? "text-blue-200" : isCompleted ? "text-green-200" : "text-gray-500"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-400"></div>
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
      <style>{`
        .animation-delay-200 {
          animation-delay: 10s;
        }
        .animation-delay-400 {
          animation-delay: 10s;
        }
        .animation-delay-2000 {
          animation-delay: 10s;
        }
        .animation-delay-4000 {
          animation-delay: 10s;
        }
      `}</style>
    </div>
  );
}
