"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileText, ArrowLeft, Target, Loader2, CheckCircle, AlertCircle, Lightbulb } from "lucide-react"
import type { ATSScore } from "@/types/resume"

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference
  
  const getColor = (score: number) => {
    if (score >= 80) return { stroke: "#22c55e", bg: "bg-green-50", text: "text-green-600" }
    if (score >= 60) return { stroke: "#eab308", bg: "bg-yellow-50", text: "text-yellow-600" }
    return { stroke: "#ef4444", bg: "bg-red-50", text: "text-red-600" }
  }
  
  const colors = getColor(score)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${colors.text}`}>{score}</span>
        <span className="text-xs text-gray-500">/ 100</span>
      </div>
    </div>
  )
}

function MiniScore({ label, score }: { label: string; score: number }) {
  const getColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{score}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(score)} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

function ScorerContent() {
  const searchParams = useSearchParams()
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [scoring, setScoring] = useState(false)
  const [score, setScore] = useState<ATSScore | null>(null)

  useEffect(() => {
    const resumeParam = searchParams.get("resume")
    const jdParam = searchParams.get("jd")
    if (resumeParam) setResumeText(decodeURIComponent(resumeParam))
    if (jdParam) setJobDescription(decodeURIComponent(jdParam))
  }, [searchParams])

  const scoreResume = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return
    setScoring(true)
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription })
      })
      const data = await res.json()
      setScore(data)
    } catch (error) {
      console.error("Scoring failed:", error)
    } finally {
      setScoring(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold">ATS Resume Scorer</span>
            </div>
          </div>
          <Link href="/builder">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Build Resume
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Resume</CardTitle>
                <CardDescription>Paste your resume text or upload</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your resume content here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="min-h-[250px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
                <CardDescription>Paste the job posting you&apos;re applying to</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px]"
                />
                <Button 
                  onClick={scoreResume}
                  disabled={scoring || !resumeText.trim() || !jobDescription.trim()}
                  className="w-full"
                  size="lg"
                >
                  {scoring ? (
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Target className="h-5 w-5 mr-2" /> Score My Resume</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {!score ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center py-12">
                  <Target className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Ready to Score Your Resume
                  </h3>
                  <p className="text-gray-400 max-w-sm">
                    Paste your resume and job description, then click &quot;Score My Resume&quot; to see how well they match.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Overall Score */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">ATS Compatibility Score</h3>
                        <p className="text-gray-500 text-sm">
                          {score.overallScore >= 80 
                            ? "Great match! Your resume is well-optimized."
                            : score.overallScore >= 60
                            ? "Good start. Some improvements recommended."
                            : "Needs work. Follow the suggestions below."}
                        </p>
                      </div>
                      <ScoreRing score={score.overallScore} />
                    </div>
                  </CardContent>
                </Card>

                {/* Score Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Score Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <MiniScore label="Keyword Match" score={score.keywordScore} />
                    <MiniScore label="Format & Structure" score={score.formatScore} />
                    <MiniScore label="Experience Relevance" score={score.experienceScore} />
                  </CardContent>
                </Card>

                {/* Strengths */}
                {score.strengths.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {score.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Missing Keywords */}
                {score.missingKeywords.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        Missing Keywords
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {score.missingKeywords.map((keyword, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Suggestions */}
                {score.suggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-blue-500" />
                        Suggestions to Improve
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {score.suggestions.map((suggestion, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-blue-500 font-bold">{i + 1}.</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ScorerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <ScorerContent />
    </Suspense>
  )
}
