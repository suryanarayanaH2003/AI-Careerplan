import React from 'react';
import { Award, BookOpen, Flag, FolderOpen, Sparkles, ArrowLeft, Clock, User, Star } from 'lucide-react';

const CareerPathResults = ({ profileData }) => {
  // Use the profileData prop or fallback to the example data structure
  const careerPath = profileData?.profile_json || {
    "Candidate Name": "NAVEENKUMAR KS",
    "job_role": "frontend developer",
    "career_path": {
      "path_name": "Career Path for frontend developer",
      "description": "A detailed career path to become proficient in frontend developer",
      "stages": [
        {
          "stage": "Stage 1: Foundation",
          "description": "Build foundational skills in high-demand areas, addressing current skill gaps.",
          "courses": [
            {
              "course_name": "Modern React",
              "description": "Comprehensive course covering React fundamentals, Hooks, Context API, and basic state management.",
              "duration": "8 weeks",
              "provider": "Udemy, Coursera, or similar platform. Consider paid courses for structured learning and support."
            },
            {
              "course_name": "REST APIs with JavaScript",
              "description": "Focus on making HTTP requests using `fetch` or Axios, understanding API design principles, and handling JSON data.",
              "duration": "4 weeks",
              "provider": "Udemy, freeCodeCamp, or similar platform."
            },
            {
              "course_name": "Responsive Web Design",
              "description": "Mastering CSS media queries, flexbox, grid, and potentially a CSS framework like Tailwind CSS.",
              "duration": "6 weeks",
              "provider": "freeCodeCamp, Scrimba, or similar platform. Supplement with Tailwind CSS documentation."
            },
            {
              "course_name": "Testing with Jest and Cypress",
              "description": "In-depth course covering unit, integration, and end-to-end testing for React applications.",
              "duration": "6 weeks",
              "provider": "Test Automation University, Udemy, or similar platform."
            },
            {
              "course_name": "Git and GitHub",
              "description": "Fundamentals of Git (init, add, commit, push, pull, branch, merge) and collaborative workflows on GitHub.",
              "duration": "2 weeks",
              "provider": "GitHub Learning Lab, freeCodeCamp, or similar platform."
            }
          ],
          "checkpoints": [
            {
              "checkpoint_name": "React Fundamentals",
              "description": "Build a simple to-do list application using React.",
              "success_criteria": "Functional to-do list with basic CRUD operations and state management."
            },
            {
              "checkpoint_name": "API Integration",
              "description": "Create a weather application fetching data from a public weather API.",
              "success_criteria": "Functional weather app displaying current conditions and forecasts."
            },
            {
              "checkpoint_name": "Responsive Design",
              "description": "Build a responsive portfolio website.",
              "success_criteria": "Website adapts smoothly to different screen sizes and devices."
            },
            {
              "checkpoint_name": "Testing",
              "description": "Write unit and integration tests for a simple React component.",
              "success_criteria": "High test coverage (80%+) with clear test cases."
            },
            {
              "checkpoint_name": "Version Control",
              "description": "Collaborate on a small project using Git and GitHub.",
              "success_criteria": "Successful collaborative workflow, demonstrating branching, merging, and conflict resolution."
            }
          ],
          "projects": [
            {
              "project_name": "To-Do List App",
              "description": "A simple to-do list application with add, delete, and edit functionalities.",
              "objectives": "Practice React fundamentals, state management, and component design."
            },
            {
              "project_name": "Weather Application",
              "description": "A weather application that fetches data from a public API and displays current weather information.",
              "objectives": "Practice API integration and data visualization."
            },
            {
              "project_name": "Responsive Portfolio Website",
              "description": "A portfolio website that is responsive across various devices.",
              "objectives": "Practice responsive design and CSS frameworks."
            },
            {
              "project_name": "Simple E-commerce Product Page",
              "description": "A single-product page with a shopping cart feature.",
              "objectives": "Combine React, REST API integration, and responsive design principles."
            }
          ]
        },
        {
          "stage": "Stage 2: Advanced Learning",
          "description": "Develop advanced skills and mastery in high-impact areas, focusing on career advancement.",
          "courses": [
            {
              "course_name": "Advanced React",
              "description": "Deep dive into advanced React Hooks, Context API, performance optimization (memoization, code splitting), and testing with Jest and React Testing Library. Explore state management solutions like Redux Toolkit or Zustand.",
              "duration": "12 weeks",
              "provider": "Frontend Masters, Udemy, or similar platform. Consider paid courses for in-depth coverage."
            },
            {
              "course_name": "Next.js",
              "description": "Learn to build server-side rendered and statically generated applications using Next.js.",
              "duration": "8 weeks",
              "provider": "Next.js documentation, Vercel tutorials, or similar resources."
            }
          ],
          "checkpoints": [
            {
              "checkpoint_name": "Advanced React Project",
              "description": "Build a complex application utilizing advanced React concepts (Hooks, Context API, Redux Toolkit/Zustand).",
              "success_criteria": "A complex, well-structured application demonstrating mastery of advanced React concepts. Should include comprehensive testing."
            },
            {
              "checkpoint_name": "Next.js Project",
              "description": "Develop a full-stack application using Next.js and a backend technology of your choice.",
              "success_criteria": "Fully functional application demonstrating understanding of server-side rendering and static site generation. Should include optimized performance."
            }
          ],
          "projects": [
            {
              "project_name": "Complex React Application",
              "description": "A real-world application showcasing advanced React concepts.",
              "objectives": "Demonstrate mastery of advanced React skills such as code-splitting, performance optimization, custom hooks, and state management."
            },
            {
              "project_name": "Next.js Application",
              "description": "Build a blog application or an e-commerce website using Next.js.",
              "objectives": "Demonstrate skills in server-side rendering, static site generation, and Next.js features."
            }
          ]
        }
      ]
    },
    "summary": "This career path focuses on building a strong foundation in frontend development, addressing NAVEENKUMAR KS's existing skills and identified skill gaps. The plan prioritizes high-demand skills, incorporates practical projects for hands-on experience, and includes checkpoints to monitor progress. By following this plan, NAVEENKUMAR KS can significantly enhance his frontend development capabilities and achieve his career goals. Continuous learning and adaptation to emerging technologies like AI-powered tools are crucial for long-term success."
  };

  // Calculate total duration
  const totalDuration = careerPath.career_path.stages.reduce((total, stage) => {
    const courseDurations = stage.courses.map(course => {
      const match = course.duration.match(/(\d+)\s*weeks?/i);
      return match ? parseInt(match[1]) : 0;
    });
    return total + courseDurations.reduce((sum, weeks) => sum + weeks, 0);
  }, 0);

  const handleBackToHome = () => {
    console.log('Navigate back to landing page');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <button
              onClick={handleBackToHome}
              className="mb-6 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:scale-105 inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>
            
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-center mb-4">
                <Award className="w-12 h-12 text-cyan-400 mr-4" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {careerPath.career_path.path_name}
                </h1>
              </div>
              <p className="text-xl text-white/80 leading-relaxed max-w-4xl mx-auto mb-4">
                {careerPath.career_path.description}
              </p>
              
              {/* Candidate info */}
              <div className="text-lg text-cyan-300 mb-6">
                Career Plan for <span className="font-semibold">{careerPath["Candidate Name"]}</span>
              </div>
              
              {/* Quick Stats */}
              <div className="flex justify-center items-center mt-6 space-x-8">
                <div className="flex items-center text-white/70">
                  <Clock className="w-5 h-5 mr-2 text-cyan-400" />
                  <span>{Math.ceil(totalDuration / 4)} weeks total</span>
                </div>
                <div className="flex items-center text-white/70">
                  <User className="w-5 h-5 mr-2 text-purple-400" />
                  <span>{careerPath.career_path.stages.length} stages</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Star className="w-5 h-5 mr-2 text-pink-400" />
                  <span className="capitalize">{careerPath.job_role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative mb-8">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500"></div>
          </div>

          {/* Stages */}
          <div className="space-y-12">
            {careerPath.career_path.stages.map((stage, index) => (
              <div key={index} className="relative">
                {/* Timeline dot */}
                <div className="absolute left-6 w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full border-4 border-slate-900 z-10"></div>
                
                <div className="ml-16 backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-xl">{index + 1}</span>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{stage.stage}</h2>
                        <p className="text-white/70">{stage.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20">
                        <span className="text-cyan-400 font-semibold">
                          {stage.courses.reduce((total, course) => {
                            const match = course.duration.match(/(\d+)\s*weeks?/i);
                            return total + (match ? parseInt(match[1]) : 0);
                          }, 0)} weeks
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Courses */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-cyan-400 flex items-center border-b border-cyan-400/30 pb-2">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Courses ({stage.courses.length})
                      </h3>
                      {stage.courses.map((course, courseIndex) => (
                        <div key={courseIndex} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                          <h4 className="font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                            {course.course_name}
                          </h4>
                          <p className="text-white/70 text-sm mb-3">{course.description}</p>
                          <div className="flex justify-between text-xs">
                            <span className="px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded">
                              {course.duration}
                            </span>
                            <span className="text-white/60 text-right">{course.provider}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Checkpoints */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-purple-400 flex items-center border-b border-purple-400/30 pb-2">
                        <Flag className="w-5 h-5 mr-2" />
                        Checkpoints ({stage.checkpoints.length})
                      </h3>
                      {stage.checkpoints.map((checkpoint, checkpointIndex) => (
                        <div key={checkpointIndex} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                          <h4 className="font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                            {checkpoint.checkpoint_name}
                          </h4>
                          <p className="text-white/70 text-sm mb-3">{checkpoint.description}</p>
                          <div className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                            <strong>Success:</strong> {checkpoint.success_criteria}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Projects */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-pink-400 flex items-center border-b border-pink-400/30 pb-2">
                        <FolderOpen className="w-5 h-5 mr-2" />
                        Projects ({stage.projects.length})
                      </h3>
                      {stage.projects.map((project, projectIndex) => (
                        <div key={projectIndex} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                          <h4 className="font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors">
                            {project.project_name}
                          </h4>
                          <p className="text-white/70 text-sm mb-3">{project.description}</p>
                          <div className="px-3 py-1 bg-pink-600/20 text-pink-400 rounded text-xs">
                            <strong>Goals:</strong> {project.objectives}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-16 backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-yellow-400 mr-3" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Journey Summary
              </h2>
            </div>
            <p className="text-xl text-white/80 leading-relaxed text-center max-w-4xl mx-auto">
              {careerPath.summary}
            </p>
            
            {/* Call to Action */}
            <div className="flex justify-center mt-8">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg">
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPathResults;