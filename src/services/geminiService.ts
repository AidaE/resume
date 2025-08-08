import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set. Please add VITE_GEMINI_API_KEY to your .env file.');
}

export interface CandidateDetails {
  name: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  skills: string;
  // Add more fields as needed
}

export async function generateResumeSections(candidate: CandidateDetails, jobDescription: string): Promise<string> {
  const prompt = `Given the following candidate details and job description, generate tailored resume sections (Summary, Experience, Skills, Education) that best match the job requirements.\n\nCandidate Details:\n${JSON.stringify(candidate, null, 2)}\n\nJob Description:\n${jobDescription}\n\nResume Sections:`;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );
    // Gemini's response structure
    const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return aiText;
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate resume sections.');
  }
} 