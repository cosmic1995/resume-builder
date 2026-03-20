import { NextRequest, NextResponse } from 'next/server'
import { gemini } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()
    
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    const prompt = `Parse this resume text and extract structured information. Return ONLY valid JSON, no markdown or explanation.

Resume text:
${text}

Extract and return this exact JSON structure (use empty strings or arrays if info not found):
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "summary": "",
  "experience": [
    {
      "company": "",
      "position": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "gpa": ""
    }
  ],
  "skills": [],
  "certifications": []
}`

    const result = await gemini.generateContent(prompt)
    const responseText = result.response.text()
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return NextResponse.json(parsed)
    }
    
    throw new Error('Failed to parse resume')
  } catch (error) {
    console.error('Parse error:', error)
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    )
  }
}
