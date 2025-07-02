"use client";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
export default function CareerPlanResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState(0);
  const [careerPlan, setCareerPlan] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (id) {
      fetchProfileById();
    } else {
      setError("Invalid profile ID");
      setIsLoading(false);
    }
  }, [id]);
  const fetchProfileById = async () => {
    console.log("Fetching profile for ID:", id);
    try {
      setIsLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/api/profile/${id}/`);
      if (!response.ok) {
        throw new Error(`Profile not found: ${response.status}`);
      }
      const fetchedData = await response.json();
      console.log("Fetched data:", fetchedData);
      setCareerPlan(fetchedData.profile_json || fetchedData);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch profile: ${err.message}`);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const downloadPlan = () => {
    if (!careerPlan) return;
    const dataStr = JSON.stringify(careerPlan, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `career-plan-${
      careerPlan.job_role ? careerPlan.job_role.toLowerCase().replace(/\s+/g, "-") : "unknown"
    }.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-6">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Loading Your Career Plan...</h3>
          <p className="text-slate-600 mb-6">Please wait while we retrieve your personalized roadmap</p>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-slate-800 animate-pulse rounded-full" style={{ width: "70%" }} />
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Unable to Load Career Plan</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-slate-800 text-white py-3 px-6 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  const profile = careerPlan || {};
  const careerPath = profile.career_path || {};
  if (!careerPath.stages || !Array.isArray(careerPath.stages)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">No Career Plan Available</h3>
          <p className="text-slate-600 mb-6">We couldn't find any career plan data for this profile.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-slate-800 text-white py-3 px-6 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Create New Plan
          </button>
        </div>
      </div>
    );
  }
  const totalCourses = careerPath.stages.reduce((acc, stage) => acc + (stage.courses ? stage.courses.length : 0), 0);
  const totalProjects = careerPath.stages.reduce((acc, stage) => acc + (stage.projects ? stage.projects.length : 0), 0);
  const totalCheckpoints = careerPath.stages.reduce((acc, stage) => acc + (stage.checkpoints ? stage.checkpoints.length : 0), 0);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-4">
      <div className="max-w-5xl mx-auto py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 bg-white border border-slate-300 py-3 px-6 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 font-medium shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Upload
          </button>
          <button
            onClick={downloadPlan}
            className="flex items-center gap-3 bg-slate-800 text-white py-3 px-6 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300 shadow-sm"
            disabled={!careerPlan}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Plan
          </button>
        </div>
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-slate-800">
                Career Plan for {profile["Candidate Name"] || "Unknown Candidate"}
              </h1>
              <p className="text-xl text-slate-600 mt-2">{profile.job_role || "Unknown Role"} Specialist</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-8 text-slate-600">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-800">{totalCourses}</div>
                <div className="text-sm">Courses</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-800">{totalProjects}</div>
                <div className="text-sm">Projects</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-800">{totalCheckpoints}</div>
                <div className="text-sm">Checkpoints</div>
              </div>
            </div>
          </div>
        </div>
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Career Path</h3>
            </div>
            <h4 className="font-medium text-slate-900 mb-2">{careerPath.path_name || "N/A"}</h4>
            <p className="text-slate-600 text-sm leading-relaxed">{careerPath.description || "No description available"}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Learning Stages</h3>
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-2">{careerPath.stages.length}</div>
            <p className="text-slate-600 text-sm leading-relaxed">Structured learning phases to master your target role</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Progress Tracking</h3>
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-2">{totalCheckpoints}</div>
            <p className="text-slate-600 text-sm leading-relaxed">Milestones to track your learning progress</p>
          </div>
        </div>
        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-8">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Executive Summary</h3>
            </div>
            <p className="text-slate-700 leading-relaxed">{profile.summary || "No summary available"}</p>
          </div>
        </div>
        {/* Career Path Stages */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-slate-800">Learning Path</h3>
            </div>
            <p className="text-slate-600">Follow this structured approach to achieve your career goals</p>
          </div>
          <div className="p-8">
            {/* Stage Navigation */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {careerPath.stages.map((stage, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStage(index)}
                  className={`flex-shrink-0 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeStage === index
                      ? "bg-slate-800 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Stage {index + 1}
                </button>
              ))}
            </div>
            {/* Stage Content */}
            {careerPath.stages.map((stage, stageIndex) => (
              <div key={stageIndex} className={`${activeStage === stageIndex ? "block" : "hidden"}`}>
                {/* Stage Header */}
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl mb-8">
                  <h4 className="text-2xl font-bold text-slate-800 mb-3">{stage.stage || "Unnamed Stage"}</h4>
                  <p className="text-slate-600 leading-relaxed">{stage.description || "No description available"}</p>
                </div>
                {/* Courses Section */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h5 className="text-xl font-semibold text-slate-800">
                      Recommended Courses ({stage.courses ? stage.courses.length : 0})
                    </h5>
                  </div>
                  
                  <div className="grid gap-4">
                    {stage.courses && stage.courses.length > 0 ? (
                      stage.courses.map((course, courseIndex) => (
                        <div
                          key={courseIndex}
                          className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 bg-white"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h6 className="font-semibold text-slate-800 text-lg">{course.course_name || "Unnamed Course"}</h6>
                            <span className="flex items-center bg-slate-100 px-3 py-1 rounded-full text-sm font-medium text-slate-600">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {course.duration || "N/A"}
                            </span>
                          </div>
                          <p className="text-slate-600 mb-4 leading-relaxed">{course.description || "No description available"}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                              {course.provider || "Unknown Provider"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        No courses available for this stage
                      </div>
                    )}
                  </div>
                </div>
                {/* Projects Section */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h5 className="text-xl font-semibold text-slate-800">
                      Recommended Projects ({stage.projects ? stage.projects.length : 0})
                    </h5>
                  </div>

                  <div className="grid gap-4">
                    {stage.projects && stage.projects.length > 0 ? (
                      stage.projects.map((project, projectIndex) => (
                        <div
                          key={projectIndex}
                          className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 bg-white"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h6 className="font-semibold text-slate-800 text-lg">{project.project_name || "Unnamed Project"}</h6>
                          </div>
                          <p className="text-slate-600 mb-4 leading-relaxed">{project.description || "No description available"}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                              {project.type || "Unknown Type"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        No projects available for this stage
                      </div>
                    )}
                  </div>
                </div>

                {/* Checkpoints Section */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h5 className="text-xl font-semibold text-slate-800">
                      Checkpoints ({stage.checkpoints ? stage.checkpoints.length : 0})
                    </h5>
                  </div>

                  <div className="grid gap-4">
                    {stage.checkpoints && stage.checkpoints.length > 0 ? (
                      stage.checkpoints.map((checkpoint, checkpointIndex) => (
                        <div
                          key={checkpointIndex}
                          className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 bg-white"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h6 className="font-semibold text-slate-800 text-lg">{checkpoint.checkpoint_name || "Unnamed Checkpoint"}</h6>
                          </div>
                          <p className="text-slate-600 mb-4 leading-relaxed">{checkpoint.description || "No description available"}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        No checkpoints available for this stage
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
