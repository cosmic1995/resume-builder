import { NextRequest, NextResponse } from 'next/server'
import { analyzeJobDescription } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { jobDescription } = await request.json()
    
    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      )
    }

    const analysis = await analyzeJobDescription(jobDescription)
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze job description' },
      { status: 500 }
    )
  }
}
