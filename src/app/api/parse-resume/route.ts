import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()
    
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured')
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Parse this resume text and extract structured information. Return ONLY valid JSON, no markdown code blocks, no explanation - just the raw JSON object.

Resume text:
${text}

Extract and return this exact JSON structure (use empty strings or empty arrays if info not found):
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
}

Remember: Return ONLY the JSON object, nothing else.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    // Clean up response - remove markdown code blocks if present
    let cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    
    // Extract JSON from response
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0])
        return NextResponse.json(parsed)
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response:', cleanedResponse)
        return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
      }
    }
    
    console.error('No JSON found in response:', cleanedResponse)
    return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 })
  } catch (error: any) {
    console.error('Parse error:', error?.message || error)
    return NextResponse.json(
      { error: error?.message || 'Failed to parse resume' },
      { status: 500 }
    )
  }
}
