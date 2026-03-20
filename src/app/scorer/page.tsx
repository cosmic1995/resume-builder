"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileText, ArrowLeft, Target, Loader2, CheckCircle, AlertCircle, Lightbulb, TrendingUp, Award } from "lucide-react"
import type { ATSScore } from "@/types/resume"

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference
  
  const getColor = (score: number) => {
    if (score >= 80) return { stroke: "url(#greenGradient)", text: "text-green-500" }
    if (score >= 60) return { stroke: "url(#yellowGradient)", text: "text-yellow-500" }
    return { stroke: "url(#redGradient)", text: "text-red-500" }
  }
  
  const colors = getColor(score)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="12"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold ${colors.text}`}>{score}</span>
        <span className="text-sm text-gray-400 font-medium">out of 100</span>
      </div>
    </div>
  )
}

function MiniScore({ label, score, icon: Icon }: { label: string; score: number; icon: any }) {
  const getColor = (score: number) => {
    if (score >= 80) return { bar: "from-green-400 to-emerald-500", text: "text-green-600" }
    if (score >= 60) return { bar: "from-yellow-400 to-orange-500", text: "text-yellow-600" }
    return { bar: "from-red-400 to-rose-500", text: "text-red-600" }
  }

  const colors = getColor(score)

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className={`text-lg font-bold ${colors.text}`}>{score}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colors.bar} transition-all duration-1000 ease-out rounded-full`}
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">ATS Scorer</span>
            </div>
          </div>
          <Link href="/builder">
            <Button variant="outline" className="rounded-full">
              <FileText className="h-4 w-4 mr-2" />
              Build Resume
            </Button>
          </Link>
        </div>
      </header>

      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-500" />
                  Your Resume
                </h3>
                <Textarea
                  placeholder="Paste your resume content here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="min-h-[200px] text-sm"
                />
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  Job Description
                </h3>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px] text-sm"
                />
                <Button 
                  onClick={scoreResume}
                  disabled={scoring || !resumeText.trim() || !jobDescription.trim()}
                  className="w-full mt-4 rounded-xl h-12"
                  size="lg"
                >
                  {scoring ? (
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Target className="h-5 w-5 mr-2" /> Score My Resume</>
                  )}
                </Button>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {!score ? (
                <div className="glass rounded-2xl h-full flex items-center justify-center min-h-[500px]">
                  <div className="text-center py-12 px-6">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                      <Target className="h-10 w-10 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Ready to Score
                    </h3>
                    <p className="text-gray-400 max-w-sm">
                      Paste your resume and job description, then click &quot;Score My Resume&quot; to see how well they match.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Overall Score */}
                  <div className="glass rounded-2xl p-8 text-center">
                    <ScoreRing score={score.overallScore} />
                    <h3 className="text-xl font-semibold mt-4 mb-2">ATS Compatibility Score</h3>
                    <p className="text-gray-500">
                      {score.overallScore >= 80 
                        ? "Excellent! Your resume is highly optimized."
                        : score.overallScore >= 60
                        ? "Good match. A few improvements could help."
                        : "Needs work. Follow the suggestions below."}
                    </p>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid gap-3">
                    <MiniScore label="Keyword Match" score={score.keywordScore} icon={Target} />
                    <MiniScore label="Format & Structure" score={score.formatScore} icon={FileText} />
                    <MiniScore label="Experience Relevance" score={score.experienceScore} icon={TrendingUp} />
                  </div>

                  {/* Strengths */}
                  {score.strengths.length > 0 && (
                    <div className="glass rounded-2xl p-6">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {score.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            </div>
                            <span className="text-gray-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Missing Keywords */}
                  {score.missingKeywords.length > 0 && (
                    <div className="glass rounded-2xl p-6">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        Missing Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {score.missingKeywords.map((keyword, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-yellow-50 text-yellow-700 text-sm rounded-full border border-yellow-200"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {score.suggestions.length > 0 && (
                    <div className="glass rounded-2xl p-6">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-indigo-500" />
                        Suggestions
                      </h4>
                      <ul className="space-y-3">
                        {score.suggestions.map((suggestion, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-indigo-600">
                              {i + 1}
                            </div>
                            <span className="text-gray-700">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ScorerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    }>
      <ScorerContent />
    </Suspense>
  )
}
