import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const gemini = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function analyzeJobDescription(jobDescription: string) {
  const prompt = `Analyze this job description and extract:
1. Required skills (technical and soft skills)
2. Required experience level
3. Key responsibilities
4. Important keywords for ATS
5. Nice-to-have qualifications

Job Description:
${jobDescription}

Respond in JSON format:
{
  "requiredSkills": [],
  "experienceLevel": "",
  "responsibilities": [],
  "atsKeywords": [],
  "niceToHave": []
}`

  const result = await gemini.generateContent(prompt)
  const text = result.response.text()
  
  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }
  throw new Error('Failed to parse job analysis')
}

export async function generateResumeContent(
  section: string,
  userInput: string,
  jobKeywords: string[]
) {
  const prompt = `You are an expert resume writer. Improve this ${section} section to be ATS-optimized.
  
User's input:
${userInput}

Target keywords to naturally incorporate (where relevant):
${jobKeywords.join(', ')}

Guidelines:
- Use action verbs
- Include quantifiable achievements where possible
- Keep it concise and professional
- Naturally incorporate relevant keywords
- Don't keyword stuff

Respond with ONLY the improved text, no explanations.`

  const result = await gemini.generateContent(prompt)
  return result.response.text()
}

export async function scoreResume(resumeText: string, jobDescription: string) {
  const prompt = `You are an ATS (Applicant Tracking System) expert. Score this resume against the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Analyze and provide:
1. Overall ATS Score (0-100)
2. Keyword Match Score (0-100)
3. Format Score (0-100)
4. Experience Relevance Score (0-100)
5. Missing Keywords (list)
6. Suggestions for improvement (list)
7. Strengths (list)

Respond in JSON format:
{
  "overallScore": number,
  "keywordScore": number,
  "formatScore": number,
  "experienceScore": number,
  "missingKeywords": [],
  "suggestions": [],
  "strengths": []
}`

  const result = await gemini.generateContent(prompt)
  const text = result.response.text()
  
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }
  throw new Error('Failed to parse score')
}
