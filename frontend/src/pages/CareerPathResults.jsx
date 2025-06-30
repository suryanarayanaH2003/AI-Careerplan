import React from 'react';
import { useLocation } from 'react-router-dom';

const CareerPathResults = () => {
  const location = useLocation();
  const { careerPath } = location.state || {};

  if (!careerPath) {
    return <div className="text-center p-4">No career path data available.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-indigo-800 mb-6 text-center">
          {careerPath.career_path.path_name}
        </h1>
        <p className="text-lg text-indigo-600 mb-8 text-center">
          {careerPath.career_path.description}
        </p>

        {careerPath.career_path.stages.map((stage, index) => (
          <div key={index} className="mb-10 p-6 bg-indigo-50 rounded-lg">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
              {stage.stage}
            </h2>
            <p className="text-indigo-600 mb-6">
              {stage.description}
            </p>

            <h3 className="text-xl font-medium text-indigo-700 mb-4">Courses:</h3>
            <div className="space-y-4 mb-6">
              {stage.courses.map((course, courseIndex) => (
                <div key={courseIndex} className="p-4 bg-white rounded-lg shadow-sm">
                  <h4 className="font-semibold text-indigo-800">
                    {course.course_name}
                  </h4>
                  <p className="text-indigo-600">
                    {course.description}
                  </p>
                  <p className="text-sm text-indigo-500">
                    Duration: {course.duration} | Provider: {course.provider}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-medium text-indigo-700 mb-4">Checkpoints:</h3>
            <div className="space-y-4 mb-6">
              {stage.checkpoints.map((checkpoint, checkpointIndex) => (
                <div key={checkpointIndex} className="p-4 bg-white rounded-lg shadow-sm">
                  <h4 className="font-semibold text-indigo-800">
                    {checkpoint.checkpoint_name}
                  </h4>
                  <p className="text-indigo-600">
                    {checkpoint.description}
                  </p>
                  <p className="text-sm text-indigo-500">
                    Success Criteria: {checkpoint.success_criteria}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-medium text-indigo-700 mb-4">Projects:</h3>
            <div className="space-y-4">
              {stage.projects.map((project, projectIndex) => (
                <div key={projectIndex} className="p-4 bg-white rounded-lg shadow-sm">
                  <h4 className="font-semibold text-indigo-800">
                    {project.project_name}
                  </h4>
                  <p className="text-indigo-600">
                    {project.description}
                  </p>
                  <p className="text-sm text-indigo-500">
                    Objectives: {project.objectives}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="text-center p-4 bg-indigo-100 rounded-lg mt-8">
          <p className="text-lg text-indigo-800">
            {careerPath.summary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareerPathResults;
