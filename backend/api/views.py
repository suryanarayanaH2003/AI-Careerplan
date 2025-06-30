import json
import re
from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
import fitz  # PyMuPDF
from .agents import interpret_resume_and_find_skill_gaps

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["CareerAI-plan"]
collection = db["profile_json_data"]

def extract_json_from_string(text):
    # Use regex to find JSON in the text
    json_match = re.search(r'```json\n(.*?)\n```', text, re.DOTALL)
    if json_match:
        return json_match.group(1)
    return None

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def profile_interpret_view(request):
    pdf_file = request.FILES.get("resume")
    job_role = request.data.get("job_role")

    if not pdf_file or not job_role:
        return Response({"error": "Resume and job role are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Extract text from PDF
    def extract_text_from_pdf(pdf):
        with fitz.open(stream=pdf.read(), filetype="pdf") as doc:
            text = ""
            for page in doc:
                text += page.get_text()
            return text

    extracted_text = extract_text_from_pdf(pdf_file)
    result = interpret_resume_and_find_skill_gaps(extracted_text, job_role)

    # Convert the CrewOutput object to a string
    result_str = str(result)

    # Extract JSON string from the result
    json_string = extract_json_from_string(result_str)

    if not json_string:
        return Response({"error": "No valid JSON data found"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Parse the JSON string into a dictionary
    try:
        profile_json = json.loads(json_string)
    except json.JSONDecodeError as e:
        return Response({"error": f"Failed to decode JSON data: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Save the parsed JSON data to MongoDB
    try:
        collection.insert_one({
            "job_role": job_role,
            "profile_json": profile_json
        })
    except Exception as e:
        return Response({"error": f"Failed to save data to MongoDB: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({
        "message": "Data processed and stored successfully",
        "data": profile_json
    })
