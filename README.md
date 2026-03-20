# ResumeAI - ATS Optimized Resume Builder

![ResumeAI](https://img.shields.io/badge/ResumeAI-v1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, AI-powered resume builder that helps you create ATS-optimized resumes that pass applicant tracking systems and land more interviews.

## ✨ Features

### 🚀 Smart Resume Import
- **Upload PDF/DOCX/TXT** - Drag & drop your existing resume
- **Paste Text** - Copy and paste resume content
- **AI Parsing** - Automatically extracts all your details using Google Gemini

### 🎯 ATS Optimization
- **Job Description Analysis** - Paste any job posting to extract key requirements
- **Keyword Matching** - Identifies missing keywords from job descriptions
- **AI-Powered Suggestions** - Get intelligent recommendations to improve each section
- **Real-time ATS Scoring** - See your compatibility score (0-100)

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Clean, modern aesthetic
- **Live Preview** - See changes in real-time
- **Responsive** - Works on desktop and mobile
- **Smooth Animations** - Polished interactions throughout

### 💾 Data Management
- **Supabase Backend** - Secure cloud storage for your resumes
- **Multiple Resumes** - Save and manage different versions
- **Export Options** - Download as PDF (coming soon)

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API
- **Database:** Supabase
- **Deployment:** Vercel
- **File Parsing:** pdf-parse, mammoth

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key
- Supabase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cosmic1995/resume-builder.git
cd resume-builder
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
resume-builder/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/      # Job description analysis
│   │   │   ├── optimize/     # AI content optimization
│   │   │   ├── parse-resume/ # Resume text parsing
│   │   │   ├── score/        # ATS scoring
│   │   │   └── upload/       # File upload handling
│   │   ├── builder/          # Resume builder page
│   │   ├── scorer/           # ATS scorer page
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Landing page
│   │   └── globals.css
│   ├── components/
│   │   └── ui/               # Reusable UI components
│   ├── lib/
│   │   ├── gemini.ts         # Gemini API client
│   │   ├── supabase.ts       # Supabase client
│   │   └── utils.ts
│   └── types/
│       └── resume.ts         # TypeScript types
├── public/
├── package.json
└── README.md
```

## 🔑 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload` | POST | Upload and extract text from PDF/DOCX/TXT |
| `/api/parse-resume` | POST | Parse resume text into structured data |
| `/api/analyze` | POST | Analyze job description for keywords |
| `/api/score` | POST | Score resume against job description |
| `/api/optimize` | POST | AI-optimize resume sections |

## 🎯 How It Works

1. **Import Your Resume**
   - Upload an existing resume (PDF, DOCX, TXT)
   - Or paste your resume text
   - Or start from scratch

2. **Add Job Description**
   - Paste the job posting you're targeting
   - AI extracts required skills, keywords, and requirements

3. **Build & Optimize**
   - Fill in your details or edit AI-parsed content
   - Click "Optimize" on any section for AI suggestions
   - Add suggested keywords to your skills

4. **Check ATS Score**
   - Get a compatibility score (0-100)
   - See missing keywords
   - Get specific improvement suggestions

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables
5. Deploy!

### Environment Variables for Production

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

Built with ❤️ to help you land your dream job.
