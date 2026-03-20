import { NextRequest, NextResponse } from 'next/server'
import { generateResumeContent } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { section, content, keywords } = await request.json()
    
    if (!section || !content) {
      return NextResponse.json(
        { error: 'Section and content are required' },
        { status: 400 }
      )
    }

    const optimized = await generateResumeContent(section, content, keywords || [])
    return NextResponse.json({ optimized })
  } catch (error) {
    console.error('Optimization error:', error)
    return NextResponse.json(
      { error: 'Failed to optimize content' },
      { status: 500 }
    )
  }
}
