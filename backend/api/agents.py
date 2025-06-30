import os
from crewai import Agent, LLM, Task, Crew
from crewai_tools import SerperDevTool

# Set API Key for LLM and SerperDev
os.environ["GEMINI_API_KEY"] = "AIzaSyCuYCQp4KTGVk3pXR2G2te36ydnGo3KApc"
os.environ["SERPER_API_KEY"] = "c7eaa6997ba95b75f4dda0a04392bd398e4961ee"  # Replace with your actual Serper API key

# Define LLM
my_llm = LLM(
    model='gemini/gemini-1.5-flash',
    api_key=os.environ["GEMINI_API_KEY"]
)

# Initialize SerperDev search tool
serper_dev_tool = SerperDevTool()

# Define the Agents
researcher = Agent(
    role="Market Researcher",
    goal="Analyze the product and audience to extract key selling points.",
    backstory="An expert in market trends and consumer behavior analysis.",
    verbose=True,
    llm=my_llm
)

skill_gap_agent = Agent(
    role="Skill Gap Analyzer",
    goal="Identify skill gaps based on job role requirements and candidate's skills",
    backstory="You are an expert in analyzing job roles and identifying the skills required for them. You compare these skills with the candidate's skills to find any gaps.",
    verbose=True,
    allow_delegation=False,
    llm=my_llm
)

real_time_job_analyzer = Agent(
    role="Real-time Job Market Analyzer",
    goal="Research current job market trends and requirements for specific job roles using real-time data",
    backstory="You are a specialist in job market analysis who uses web search to find the most current and in-demand skills for specific job roles. You analyze job postings, industry reports, and market trends to provide up-to-date skill requirements.",
    verbose=True,
    allow_delegation=False,
    tools=[serper_dev_tool],
    llm=my_llm
)

skill_priority_agent = Agent(
    role="Skill Priority Strategist",
    goal="Prioritize technical skills based on current market demand, candidate's existing skills, and career impact",
    backstory="You are an expert career strategist who analyzes skill gaps and market demands to create prioritized learning paths. You focus on specific technical skills required by hiring companies and suggest advanced learning for skills the candidate already possesses.",
    verbose=True,
    allow_delegation=False,
    llm=my_llm
)

career_path_agent = Agent(
    role="Career Path Strategist",
    goal="Provide a clear career path with detailed course information, checkpoints, and hands-on projects",
    backstory="You are an expert in career development who creates detailed career paths, including specific courses, checkpoints, and hands-on projects to ensure practical experience and skill mastery.",
    verbose=True,
    allow_delegation=False,
    llm=my_llm
)

def interpret_resume_and_find_skill_gaps(extracted_text, job_role):
    # Define tasks for the agents
    interpret_task = Task(
        description=f"""
        Based on the job role '{job_role}', extract structured information from this resume text.

        Resume:
        {extracted_text}

        Output the result as a JSON with keys:
        'name', 'email', 'phone', 'skills', 'education', 'experience', 'projects', 'certifications'.
        """,
        expected_output="JSON with relevant structured fields for candidate profiling and skills should be extracted in single array not as categorizing.",
        agent=researcher
    )

    skill_gap_task = Task(
        description=f"""
        Based on the job role '{job_role}', identify the required skills for this role based on general industry knowledge. Compare these required skills with the candidate's skills to find any gaps.

        Job Role: {job_role}
        Candidate Skills: {{{{ skills }}}}

        Steps to follow:
        1. **Identify Required Skills**: List all the skills that are generally required for the job role '{job_role}'.
        2. **List Candidate Skills**: Extract the skills from the candidate's profile.
        3. **Compare Skills**: Compare the required skills with the candidate's skills to identify any gaps.
        4. **Output the Result**: Provide the result in a structured JSON format with the following keys:
        - 'required_skills': A list of skills required for the job role.
        - 'candidate_skills': A list of skills possessed by the candidate.
        - 'skill_gaps': A list of skills that the candidate lacks but are required for the job role.
        """,
        expected_output="""
        {
            "required_skills": ["skill1", "skill2", "skill3"],
            "candidate_skills": ["skill1", "skill3"],
            "skill_gaps": ["skill2"]
        }""",
        agent=skill_gap_agent
    )

    real_time_analysis_task = Task(
        description=f"""
        Research the current job market for the role '{job_role}' using web search to find:
        1. Latest job postings and their requirements
        2. Current industry trends and in-demand skills
        3. Emerging technologies and tools for this role
        4. Salary trends and skill premiums

        Search for:
        - "{job_role} job requirements 2024 2025"
        - "{job_role} skills in demand"
        - "{job_role} latest technologies"
        - "trending skills {job_role}"

        Analyze the search results and provide a comprehensive list of current market-demanded skills for {job_role}.
        """,
        expected_output="""
        {
            "job_role": "{job_role}",
            "current_market_skills": ["skill1", "skill2", "skill3"],
            "trending_skills": ["new_skill1", "new_skill2"],
            "high_demand_skills": ["critical_skill1", "critical_skill2"],
            "emerging_technologies": ["tech1", "tech2"],
            "search_insights": "Summary of key findings from job market research"
        }""",
        agent=real_time_job_analyzer
    )

    
    
    skill_prioritization_task = Task(
    description=f"""
    Based on the previous analysis, create a prioritized technical skill development plan by comparing:
    1. Required technical skills (from skill gap analysis)
    2. Current market technical skills (from real-time analysis)
    3. Candidate's existing technical skills

    Create a priority matrix considering:
    - Market demand for technical skills (high/medium/low)
    - Technical skill gap urgency (critical/important/nice-to-have)
    - Learning difficulty for technical skills (easy/medium/hard)
    - Career impact of technical skills (high/medium/low)

    For technical skills the candidate already possesses, suggest advanced learning or mastery to enhance their skill set.
    Prioritize technical skills that are in high demand in the current market and align with the tech stacks required by hiring companies.
    Include both advanced plans for current skills and new high-value skills to follow.

    Job Role: {job_role}
    """,
    expected_output="""
    {
        "priority_skills": [
            {
                "skill": "specific_technical_skill_name",
                "priority_level": "high/medium/low",
                "market_demand": "high/medium/low",
                "learning_difficulty": "easy/medium/hard",
                "career_impact": "high/medium/low",
                "reason": "explanation for prioritization",
                "learning_path": "advanced plan for current skills/high-value new skills"
            }
        ],
        "advanced_learning_plans": [
            {
                "skill": "specific_technical_skill_name",
                "learning_path": "advanced plan details"
            }
        ],
        "high_value_skills_to_follow": [
            {
                "skill": "specific_technical_skill_name",
                "reason": "explanation for high value"
            }
        ],
        "learning_path_summary": "Overall strategy and recommendations for technical skills enhancement"
    }
    """,
    agent=skill_priority_agent,
    context=[interpret_task, skill_gap_task, real_time_analysis_task]
)
    
    career_path_task = Task(
    description=f"""
    Based on the previous analyses, create a comprehensive career development plan that includes:
    1. A clear career path with detailed course information.
    2. Checkpoints to assess progress.
    3. Hands-on projects for practical experience.

    Use the priority matrix, advanced learning plans, and high-value skills identified earlier to design this plan.
    Ensure the plan is practical and aligns with current market demands and the candidate's existing skills.

    Job Role: {job_role}
    """,
    expected_output="""
    {{
        "Candidate Name": "Candidate Name",
        "job_role": "{job_role}",
        "career_path": {{
            "path_name": "Career Path for {job_role}",
            "description": "A detailed career path to become proficient in {job_role}",
            "stages": [
                {{
                    "stage": "Stage 1: Foundation",
                    "description": "Build foundational skills",
                    "courses": [
                        {{
                            "course_name": "Course Name",
                            "description": "Course Description",
                            "duration": "Course Duration",
                            "provider": "Course Provider"
                        }}
                    ],
                    "checkpoints": [
                        {{
                            "checkpoint_name": "Checkpoint Name",
                            "description": "Checkpoint Description",
                            "success_criteria": "Success Criteria"
                        }}
                    ],
                    "projects": [
                        {{
                            "project_name": "Project Name",
                            "description": "Project Description",
                            "objectives": "Project Objectives"
                        }}
                    ]
                }},
                {{
                    "stage": "Stage 2: Advanced Learning",
                    "description": "Develop advanced skills and mastery",
                    "courses": [
                        {{
                            "course_name": "Advanced Course Name",
                            "description": "Advanced Course Description",
                            "duration": "Advanced Course Duration",
                            "provider": "Advanced Course Provider"
                        }}
                    ],
                    "checkpoints": [
                        {{
                            "checkpoint_name": "Advanced Checkpoint Name",
                            "description": "Advanced Checkpoint Description",
                            "success_criteria": "Advanced Success Criteria"
                        }}
                    ],
                    "projects": [
                        {{
                            "project_name": "Advanced Project Name",
                            "description": "Advanced Project Description",
                            "objectives": "Advanced Project Objectives"
                        }}
                    ]
                }}
            ]
        }},
        "summary": "Overall summary and recommendations for career development"
    }}
    """,
    agent=career_path_agent,
    context=[skill_prioritization_task,interpret_task]
)
        # Create and execute the crew
    crew = Crew(
        agents=[researcher, skill_gap_agent, real_time_job_analyzer, skill_priority_agent, career_path_agent],
        tasks=[interpret_task, skill_gap_task, real_time_analysis_task, skill_prioritization_task, career_path_task],
        verbose=True
    )

    result = crew.kickoff()
    return result
