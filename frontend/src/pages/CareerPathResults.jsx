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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 text-center">
          <div className="animate-pulse">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Loading Your Career Plan...</h3>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 transition-all"
          >
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 text-center">
          <p className="text-gray-600 mb-4">No career plan data available.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const totalCourses = careerPath.stages.reduce((acc, stage) => acc + (stage.courses ? stage.courses.length : 0), 0);
  const totalProjects = careerPath.stages.reduce((acc, stage) => acc + (stage.projects ? stage.projects.length : 0), 0);
  const totalCheckpoints = careerPath.stages.reduce((acc, stage) => acc + (stage.checkpoints ? stage.checkpoints.length : 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 border border-gray-300 bg-transparent py-2 px-4 rounded-md text-gray-700 hover:bg-gray-100 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Upload
          </button>
          <button
            onClick={downloadPlan}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-md hover:from-green-600 hover:to-emerald-700 transition-all"
            disabled={!careerPlan}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download Plan
          </button>
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-fade-in">
            Career Plan for {profile["Candidate Name"] || "Unknown Candidate"}
          </h1>
          <p className="text-xl text-gray-600 mb-4">{profile.job_role || "Unknown Role"} Specialist</p>
          <div className="flex justify-center gap-6 text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h20v20H2zM12 2v2M20 10v2M2 10v2M20 6v2M2 6v2M8 21h8M8 3h8" />
              </svg>
              <span>{totalCourses} Courses</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
              </svg>
              <span>{totalProjects} Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />
              </svg>
              <span>{totalCheckpoints} Checkpoints</span>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
            <h3 className="text-lg font-semibold text-blue-700">Career Path</h3>
            <h4 className="font-medium text-gray-900 mt-2">{careerPath.path_name || "N/A"}</h4>
            <p className="text-gray-600 mt-2">{careerPath.description || "No description available"}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
            <h3 className="text-lg font-semibold text-green-700">Learning Stages</h3>
            <div className="text-2xl font-bold text-green-600 mt-2">{careerPath.stages.length}</div>
            <p className="text-gray-600 mt-2">Structured learning phases to master your target role</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
            <h3 className="text-lg font-semibold text-purple-700">Progress Tracking</h3>
            <div className="text-2xl font-bold text-purple-600 mt-2">{totalCheckpoints}</div>
            <p className="text-gray-600 mt-2">Milestones to track your learning progress</p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg mb-8">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900">Executive Summary</h3>
            <p className="text-gray-700 mt-2 leading-relaxed">{profile.summary || "No summary available"}</p>
          </div>
        </div>

        {/* Career Path Stages */}
        <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg">
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-gray-900">Learning Path</h3>
            <p className="text-gray-600 mt-1">Follow this structured approach to achieve your career goals</p>
          </div>
          <div className="p-6">
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {careerPath.stages.map((stage, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStage(index)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    activeStage === index
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                  } border`}
                >
                  Stage {index + 1}
                </button>
              ))}
            </div>
            {careerPath.stages.map((stage, stageIndex) => (
              <div key={stageIndex} className={`${activeStage === stageIndex ? "block" : "hidden"} animate-fade-in`}>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-6">
                  <h4 className="text-xl font-bold text-blue-700 mb-2">{stage.stage || "Unnamed Stage"}</h4>
                  <p className="text-blue-600">{stage.description || "No description available"}</p>
                </div>
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h20v20H2zM12 2v2M20 10v2M2 10v2M20 6v2M2 6v2M8 21h8M8 3h8" />
                    </svg>
                    Recommended Courses ({stage.courses ? stage.courses.length : 0})
                  </h5>
                  <div className="grid gap-4">
                    {stage.courses && stage.courses.length > 0 ? (
                      stage.courses.map((course, courseIndex) => (
                        <div
                          key={courseIndex}
                          className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h6 className="font-medium text-gray-900">{course.course_name || "Unnamed Course"}</h6>
                            <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-xs">
                              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              {course.duration || "N/A"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{course.description || "No description available"}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-blue-600">{course.provider || "Unknown Provider"}</span>
                            {/* <button
                              onClick={() => course.url && window.open(course.url, "_blank")}
                              className="flex items-center gap-1 border border-gray-300 bg-transparent px-2 py-1 rounded-md text-xs hover:bg-gray-100 transition-all"
                              disabled={!course.url}
                            >
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                              </svg>
                              View Course
                            </button> */}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No courses available for this stage.</p>
                    )}
                  </div>
                </div>
                <div className="mt-8">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                    </svg>
                    Hands-on Projects ({stage.projects ? stage.projects.length : 0})
                  </h5>
                  <div className="grid gap-2">
                    {stage.projects && stage.projects.length > 0 ? (
                      stage.projects.map((project, projectIndex) => (
                        <div key={projectIndex} className="border border-gray-200 rounded-lg">
                          <button
                            className="w-full p-4 text-left bg-transparent font-medium text-gray-900 hover:bg-gray-50 transition-all"
                          >
                            {project.project_name || "Unnamed Project"}
                          </button>
                          <div className="p-4 pt-0 grid gap-3">
                            <div>
                              <h6 className="font-medium text-gray-900 mb-1">Description</h6>
                              <p className="text-sm text-gray-600">{project.description || "No description available"}</p>
                            </div>
                            <div>
                              <h6 className="font-medium text-gray-900 mb-1">Learning Objectives</h6>
                              <p className="text-sm text-gray-600">{project.objectives || "No objectives available"}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No projects available for this stage.</p>
                    )}
                  </div>
                </div>
                <div className="mt-8">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />
                    </svg>
                    Progress Checkpoints ({stage.checkpoints ? stage.checkpoints.length : 0})
                  </h5>
                  <div className="grid gap-4">
                    {stage.checkpoints && stage.checkpoints.length > 0 ? (
                      stage.checkpoints.map((checkpoint, checkpointIndex) => (
                        <div
                          key={checkpointIndex}
                          className="border border-purple-100 bg-purple-50/50 rounded-lg p-4"
                        >
                          <div className="flex gap-3">
                            <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />
                            </svg>
                            <div className="flex-1">
                              <h6 className="font-semibold text-purple-700 mb-1">{checkpoint.checkpoint_name || "Unnamed Checkpoint"}</h6>
                              <p className="text-sm text-purple-600 mb-2">{checkpoint.description || "No description available"}</p>
                              <div className="bg-white/80 p-2 rounded-md border border-purple-100">
                                <span className="text-xs font-medium text-purple-700">Success Criteria:</span>
                                <p className="text-xs text-purple-600 mt-1">{checkpoint.success_criteria || "No criteria available"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No checkpoints available for this stage.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}