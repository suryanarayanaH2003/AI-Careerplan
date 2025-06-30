import React, { useState } from 'react';
import { Sparkles, Upload, Target, TrendingUp, CheckCircle, Star, Zap, Rocket } from 'lucide-react';

const LandingPage = () => {
  const [resume, setResume] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  // For demo purposes, you can replace this with your actual navigation logic
  const navigateToResults = (careerPath) => {
    console.log('Navigate to results with:', careerPath);
    // Example: window.location.href = '/career-path';
  };

  const loadingSteps = [
    { text: "Analyzing your resume...", icon: <Upload className="w-5 h-5" /> },
    { text: "Identifying your skills...", icon: <Star className="w-5 h-5" /> },
    { text: "Comparing with desired job role...", icon: <Target className="w-5 h-5" /> },
    { text: "Generating your career path...", icon: <TrendingUp className="w-5 h-5" /> },
    { text: "Finalizing recommendations...", icon: <Sparkles className="w-5 h-5" /> }
  ];

  const handleSubmit = async () => {
    if (!resume || !jobRole) return;
    
    setIsLoading(true);
    setLoadingStep(0);

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('job_role', jobRole);

    try {
      // Simulate loading steps
      for (let i = 0; i < loadingSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        setLoadingStep(i + 1);
      }

      // Replace this with your actual API call
      const response = await fetch('http://localhost:8000/api/profile-interpret/', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      navigateToResults(data.data);
    } catch (error) {
      console.error('Error uploading resume:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-1000"></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-sm bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Rocket className="w-8 h-8 text-cyan-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                CareerPath Pro
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              {/* <a href="#features" className="text-white/80 hover:text-cyan-400 transition-colors duration-300">Features</a>
              <a href="#how-it-works" className="text-white/80 hover:text-cyan-400 transition-colors duration-300">How It Works</a>
              <a href="#testimonials" className="text-white/80 hover:text-cyan-400 transition-colors duration-300">Testimonials</a> */}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <section className="py-20 px-6">
          <div className="container mx-auto text-center">
            <div className="animate-fade-in">
              <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                Unlock Your
                <br />
                Career Potential
              </h2>
              <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform your career with AI-powered insights. Upload your resume and discover a personalized roadmap to your dream job.
              </p>
            </div>

            {/* Upload Form */}
            <div className="max-w-lg mx-auto">
              <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl">
                <div className="space-y-6">
                  <div className="text-left">
                    <label className="block text-white/90 text-sm font-semibold mb-3">
                      <Upload className="w-4 h-4 inline mr-2" />
                      Upload Your Resume
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => setResume(e.target.files[0])}
                        className="w-full p-4 bg-white/5 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 file:cursor-pointer"
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <label className="block text-white/90 text-sm font-semibold mb-3">
                      <Target className="w-4 h-4 inline mr-2" />
                      Desired Job Role
                    </label>
                    <input
                      type="text"
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      className="w-full p-4 bg-white/5 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                      placeholder="e.g., Full Stack Developer"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isLoading || !resume || !jobRole}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Zap className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Career Path
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Loading Animation */}
              {isLoading && (
                <div className="mt-8 backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl animate-fade-in">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-6">
                    <Sparkles className="w-6 h-6 inline mr-2" />
                    Crafting Your Career Path
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    {loadingSteps.map((step, index) => (
                      <div key={index} className="flex items-center p-3 rounded-xl bg-white/5 transition-all duration-500">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all duration-500 ${
                          index < loadingStep 
                            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' 
                            : 'bg-white/20 text-white/60'
                        }`}>
                          {index < loadingStep ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            step.icon
                          )}
                        </div>
                        <p className={`transition-all duration-500 ${
                          index < loadingStep 
                            ? 'text-white font-semibold' 
                            : 'text-white/70'
                        }`}>
                          {step.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(loadingStep / loadingSteps.length) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-white/70 text-sm">
                      Step {loadingStep} of {loadingSteps.length}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6">
          <div className="container mx-auto">
            <h3 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Why Choose CareerPath Pro?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">AI-Powered Analysis</h4>
                <p className="text-white/70">Advanced algorithms analyze your skills and experience to create personalized career recommendations.</p>
              </div>
              <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">Targeted Roadmaps</h4>
                <p className="text-white/70">Get specific learning paths with courses, projects, and milestones tailored to your desired role.</p>
              </div>
              <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-cyan-600 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">Track Progress</h4>
                <p className="text-white/70">Monitor your growth with clear checkpoints and achievements along your career journey.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-sm bg-white/5 border-t border-white/20 py-8">
        <div className="container mx-auto px-6 text-center text-white/60">
          <p>&copy; 2024 CareerPath Pro. Empowering careers with AI.</p>
        </div>
      </footer>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;