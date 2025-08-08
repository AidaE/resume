import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function generateProfessionalSummary(jobDescription: string): Promise<string> {
  const prompt = `Write an extremely short professional resume summary (1 sentence, maximum 25 words) for a candidate applying to the following job. Focus on matching the tone and requirements of the job description. IMPORTANT: Do NOT mention the company name in the summary.\n\nJob Description:\n${jobDescription}\n\nProfessional Summary:`;

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert resume writer. Never mention company names in professional summaries.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 60,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const summary = response.data.choices?.[0]?.message?.content?.trim() || '';
    return summary;
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate professional summary.');
  }
}

export async function extractCompanyAndJobTitle(jobDescription: string): Promise<{ company: string; jobTitle: string }> {
  const prompt = `Extract the company name and job title from the following job description. Respond ONLY in this JSON format: { "company": "...", "jobTitle": "..." }\n\nJob Description:\n${jobDescription}`;

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 60,
        temperature: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const text = response.data.choices?.[0]?.message?.content?.trim() || '{}';
    const json = JSON.parse(text.replace(/```json|```/g, '').trim());
    return {
      company: json.company || '',
      jobTitle: json.jobTitle || ''
    };
  } catch (error: any) {
    console.error('OpenAI API error (extractCompanyAndJobTitle):', error);
    return { company: '', jobTitle: '' };
  }
}

export async function extractToolsAndSkills(jobDescription: string, existingSkills: string[] = []): Promise<{ tools: string[]; skills: string[] }> {
  const existingSkillsText = existingSkills.length > 0 ? `\n\nExisting Skills: ${existingSkills.join(', ')}` : '';
  const prompt = `Extract the tools and skills required or preferred from the following job description. Also consider the existing skills provided and suggest additional relevant skills/tools that would complement them. Respond ONLY in this JSON format: { "tools": ["..."], "skills": ["..."] }\n\nJob Description:\n${jobDescription}${existingSkillsText}`;

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that analyzes job requirements and suggests complementary skills.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 120,
        temperature: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const text = response.data.choices?.[0]?.message?.content?.trim() || '{}';
    const json = JSON.parse(text.replace(/```json|```/g, '').trim());
    return {
      tools: Array.isArray(json.tools) ? json.tools : [],
      skills: Array.isArray(json.skills) ? json.skills : []
    };
  } catch (error: any) {
    console.error('OpenAI API error (extractToolsAndSkills):', error);
    return { tools: [], skills: [] };
  }
} 