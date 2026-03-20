import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const fileName = file.name.toLowerCase()
    let text = ''

    if (fileName.endsWith('.txt')) {
      text = await file.text()
    } else if (fileName.endsWith('.pdf')) {
      const buffer = Buffer.from(await file.arrayBuffer())
      // @ts-ignore - pdf-parse types issue
      const pdfParse = require('pdf-parse')
      const data = await pdfParse(buffer)
      text = data.text
    } else if (fileName.endsWith('.docx')) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, DOCX, or TXT.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
}
