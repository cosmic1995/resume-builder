import { NextRequest, NextResponse } from 'next/server'
import { scoreResume } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json()
    
    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume and job description are required' },
        { status: 400 }
      )
    }

    const score = await scoreResume(resumeText, jobDescription)
    return NextResponse.json(score)
  } catch (error) {
    console.error('Scoring error:', error)
    return NextResponse.json(
      { error: 'Failed to score resume' },
      { status: 500 }
    )
  }
}
