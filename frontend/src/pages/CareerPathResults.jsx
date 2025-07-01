import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';



export default function EnhancedCareerPlanResults() {
  const { id } = useParams();
  const [activeStage, setActiveStage] = useState(0);
  const [careerPlan, setCareerPlan] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);
  const [completedCheckpoints, setCompletedCheckpoints] = useState(new Set());

  useEffect(() => {
    const fetchCareerPlan = async () => {
      try {
        setIsLoading(true);
        if (!id) {
          setError("No profile ID provided.");
          setIsLoading(false);
          return;
        }
        const response = await fetch(`http://localhost:8000/api/profile/${id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCareerPlan(data.profile_json); // Adjust this line to match your backend response structure
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareerPlan();
  }, [id]);

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

  const toggleCheckpoint = (stageIndex, checkpointIndex) => {
    const key = `${stageIndex}-${checkpointIndex}`;
    const newCompleted = new Set(completedCheckpoints);
    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
    }
    setCompletedCheckpoints(newCompleted);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative z-10 max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-spin">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Loading Your Career Plan...</h3>
            <p className="text-gray-300">Preparing your personalized roadmap to success</p>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Oops! Something went wrong</h3>
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if careerPlan or stages are not available
  if (!careerPlan || !careerPlan.career_path || !careerPlan.career_path.stages || careerPlan.career_path.stages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">No Career Plan Available</h3>
            <p className="text-gray-300">We couldn't find any career plan data for this profile.</p>
          </div>
        </div>
      </div>
    );
  }

  const totalCourses = careerPlan.career_path.stages.reduce((acc, stage) => acc + (stage.courses ? stage.courses.length : 0), 0);
  const totalProjects = careerPlan.career_path.stages.reduce((acc, stage) => acc + (stage.projects ? stage.projects.length : 0), 0);
  const totalCheckpoints = careerPlan.career_path.stages.reduce((acc, stage) => acc + (stage.checkpoints ? stage.checkpoints.length : 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <button
            onClick={() => navigate('/')}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 py-3 px-6 rounded-2xl text-white hover:bg-white/20 transition-all transform hover:scale-105"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Upload
            </button>

            <button
              onClick={downloadPlan}
              className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
              disabled={!careerPlan}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download Plan
            </button>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-6 shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-blue-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Career Roadmap
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
              {careerPlan["Candidate Name"] || "Your Journey"}
            </h2>
            <p className="text-xl text-gray-300 mb-8">{careerPlan.job_role || "Unknown Role"} Specialist</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">{totalCourses}</div>
                <p className="text-gray-300">Learning Courses</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">{totalProjects}</div>
                <p className="text-gray-300">Hands-on Projects</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-full mx-auto mb-4">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">{totalCheckpoints}</div>
                <p className="text-gray-300">Progress Milestones</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Career Path</h3>
              </div>
              <h4 className="text-xl font-semibold text-blue-300 mb-4">
                {careerPlan.career_path.path_name || "Custom Learning Path"}
              </h4>
              <p className="text-gray-300 leading-relaxed">
                {careerPlan.career_path.description ||
                  "A personalized learning journey designed to help you achieve your career goals through structured stages and practical experience."}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Executive Summary</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {careerPlan.summary ||
                  "This comprehensive career plan provides a structured approach to developing the skills and experience needed for your target role. Each stage builds upon the previous one, ensuring steady progress toward your career objectives."}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
            <div className="p-8 border-b border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Learning Journey</h3>
                  <p className="text-gray-300">Follow this structured path to achieve your career goals</p>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {careerPlan.career_path.stages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStage(index)}
                    className={`flex-shrink-0 px-6 py-3 rounded-2xl font-semibold transition-all transform hover:scale-105 ${
                      activeStage === index
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    Stage {index + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-8">
              {careerPlan.career_path.stages.map((stage, stageIndex) => (
                <div key={stageIndex} className={`${activeStage === stageIndex ? "block" : "hidden"} space-y-8`}>
                  <div className="bg-gradient-to-r from-blue-500/20 to-blue-500/20 p-8 rounded-3xl border border-blue-500/30">
                    <h4 className="text-3xl font-bold text-white mb-4">{stage.stage || `Stage ${stageIndex + 1}`}</h4>
                    <p className="text-blue-200 text-lg leading-relaxed">
                      {stage.description || "Complete this stage to advance your skills and knowledge."}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h5 className="text-2xl font-bold text-white">Courses</h5>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {stage.courses && stage.courses.map((course, courseIndex) => (
                        <div key={courseIndex} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all">
                          <h6 className="text-xl font-bold text-white mb-2">{course.course_name}</h6>
                          <p className="text-gray-300 mb-3">{course.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="text-blue-400 font-semibold">{course.duration}</div>
                            <div className="text-sm bg-blue-500/20 px-3 py-1 rounded-full text-blue-300">{course.provider}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h5 className="text-2xl font-bold text-white">Projects</h5>
                    </div>
                    <div className="space-y-4">
                      {stage.projects && stage.projects.map((project, projectIndex) => (
                        <div key={projectIndex} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                          <div className="flex justify-between items-start">
                            <div>
                              <h6 className="text-xl font-bold text-white mb-2">{project.project_name}</h6>
                              <p className="text-gray-300">{project.description}</p>
                            </div>
                            <button
                              onClick={() => setExpandedProject(expandedProject === projectIndex ? null : projectIndex)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expandedProject === projectIndex ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                              </svg>
                            </button>
                          </div>
                          {expandedProject === projectIndex && (
                            <div className="mt-4 p-4 bg-white/5 rounded-xl">
                              <p className="text-gray-200"><strong>Objectives:</strong> {project.objectives}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h5 className="text-2xl font-bold text-white">Checkpoints</h5>
                    </div>
                    <div className="space-y-4">
                      {stage.checkpoints && stage.checkpoints.map((checkpoint, checkpointIndex) => {
                        const key = `${stageIndex}-${checkpointIndex}`;
                        return (
                          <div key={checkpointIndex} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-center">
                            <button
                              onClick={() => toggleCheckpoint(stageIndex, checkpointIndex)}
                              className={`w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0 ${completedCheckpoints.has(key) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-400'}`}
                            ></button>
                            <div>
                              <h6 className="text-lg font-bold text-white">{checkpoint.checkpoint_name}</h6>
                              <p className="text-gray-300">{checkpoint.description}</p>
                              <p className="text-emerald-400 text-sm mt-1"><strong>Success Criteria:</strong> {checkpoint.success_criteria}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
