"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, ArrowLeft, Plus, Trash2, Sparkles, Loader2, 
  Upload, ClipboardPaste, Eye, EyeOff, Download, X, Check
} from "lucide-react"
import type { Resume, Experience, Education, JobAnalysis } from "@/types/resume"

const emptyExperience = (): Experience => ({
  id: crypto.randomUUID(),
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  achievements: []
})

const emptyEducation = (): Education => ({
  id: crypto.randomUUID(),
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  gpa: ""
})

const initialResume: Resume = {
  title: "My Resume",
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: ""
  },
  summary: "",
  experience: [emptyExperience()],
  education: [emptyEducation()],
  skills: [],
  certifications: []
}

type ImportMode = "choose" | "upload" | "paste" | "manual" | null

export default function BuilderPage() {
  const [importMode, setImportMode] = useState<ImportMode>("choose")
  const [uploading, setUploading] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [pasteText, setPasteText] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [jobDescription, setJobDescription] = useState("")
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [optimizing, setOptimizing] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  
  const [resume, setResume] = useState<Resume>(initialResume)
  const [skillInput, setSkillInput] = useState("")
  const [certInput, setCertInput] = useState("")

  // File upload handler
  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!uploadRes.ok) throw new Error('Upload failed')
      
      const { text } = await uploadRes.json()
      await parseResumeText(text)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to process file. Please try again or paste your resume text.')
    } finally {
      setUploading(false)
    }
  }

  // Parse resume text with AI
  const parseResumeText = async (text: string) => {
    setParsing(true)
    try {
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      
      if (!res.ok) throw new Error('Parse failed')
      
      const parsed = await res.json()
      
      // Merge parsed data with resume state
      setResume(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, ...parsed.personalInfo },
        summary: parsed.summary || prev.summary,
        experience: parsed.experience?.length > 0 
          ? parsed.experience.map((exp: any) => ({ ...emptyExperience(), ...exp, id: crypto.randomUUID() }))
          : prev.experience,
        education: parsed.education?.length > 0
          ? parsed.education.map((edu: any) => ({ ...emptyEducation(), ...edu, id: crypto.randomUUID() }))
          : prev.education,
        skills: parsed.skills?.length > 0 ? parsed.skills : prev.skills,
        certifications: parsed.certifications?.length > 0 ? parsed.certifications : prev.certifications
      }))
      
      setImportMode(null)
    } catch (error) {
      console.error('Parse error:', error)
      alert('Failed to parse resume. Please try manual entry.')
    } finally {
      setParsing(false)
    }
  }

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }, [])

  const analyzeJob = async () => {
    if (!jobDescription.trim()) return
    setAnalyzing(true)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription })
      })
      const data = await res.json()
      setJobAnalysis(data)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  const optimizeSection = async (section: string, content: string) => {
    if (!content.trim()) return content
    setOptimizing(section)
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          section, 
          content,
          keywords: jobAnalysis?.atsKeywords || []
        })
      })
      const data = await res.json()
      return data.optimized
    } catch (error) {
      console.error("Optimization failed:", error)
      return content
    } finally {
      setOptimizing(null)
    }
  }

  const updatePersonalInfo = (field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }

  const updateExperience = (id: string, field: string, value: any) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const addExperience = () => setResume(prev => ({
    ...prev,
    experience: [...prev.experience, emptyExperience()]
  }))

  const removeExperience = (id: string) => setResume(prev => ({
    ...prev,
    experience: prev.experience.filter(exp => exp.id !== id)
  }))

  const updateEducation = (id: string, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const addEducation = () => setResume(prev => ({
    ...prev,
    education: [...prev.education, emptyEducation()]
  }))

  const removeEducation = (id: string) => setResume(prev => ({
    ...prev,
    education: prev.education.filter(edu => edu.id !== id)
  }))

  const addSkill = () => {
    if (skillInput.trim() && !resume.skills.includes(skillInput.trim())) {
      setResume(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }))
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    setResume(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  }

  const addCertification = () => {
    if (certInput.trim() && !resume.certifications.includes(certInput.trim())) {
      setResume(prev => ({ ...prev, certifications: [...prev.certifications, certInput.trim()] }))
      setCertInput("")
    }
  }

  const removeCertification = (cert: string) => {
    setResume(prev => ({ ...prev, certifications: prev.certifications.filter(c => c !== cert) }))
  }

  const generateResumeText = () => {
    const { personalInfo, summary, experience, education, skills, certifications } = resume
    let text = `${personalInfo.fullName}\n`
    text += `${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}\n`
    if (personalInfo.linkedin) text += `${personalInfo.linkedin}\n`
    if (personalInfo.website) text += `${personalInfo.website}\n`
    text += `\nSUMMARY\n${summary}\n`
    text += `\nEXPERIENCE\n`
    experience.forEach(exp => {
      text += `${exp.position} at ${exp.company}\n`
      text += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`
      text += `${exp.description}\n\n`
    })
    text += `EDUCATION\n`
    education.forEach(edu => {
      text += `${edu.degree} in ${edu.field}\n`
      text += `${edu.institution}, ${edu.startDate} - ${edu.endDate}\n`
      if (edu.gpa) text += `GPA: ${edu.gpa}\n`
    })
    text += `\nSKILLS\n${skills.join(', ')}\n`
    if (certifications.length > 0) {
      text += `\nCERTIFICATIONS\n${certifications.join('\n')}\n`
    }
    return text
  }

  // Import Mode Selection Screen
  if (importMode === "choose") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <h1 className="text-4xl font-bold mb-4">How would you like to start?</h1>
            <p className="text-xl text-gray-600">Choose an option to begin building your ATS-optimized resume</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Upload Option */}
            <button
              onClick={() => setImportMode("upload")}
              className="glass rounded-2xl p-8 text-left card-hover group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
              <p className="text-gray-600">Upload your existing PDF or DOCX resume and we&apos;ll extract the details</p>
              <div className="mt-4 text-sm text-gray-400">Supports PDF, DOCX, TXT</div>
            </button>

            {/* Paste Option */}
            <button
              onClick={() => setImportMode("paste")}
              className="glass rounded-2xl p-8 text-left card-hover group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ClipboardPaste className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Paste Resume</h3>
              <p className="text-gray-600">Copy and paste your resume text and we&apos;ll parse it automatically</p>
              <div className="mt-4 text-sm text-gray-400">Quick and easy</div>
            </button>

            {/* Manual Option */}
            <button
              onClick={() => setImportMode(null)}
              className="glass rounded-2xl p-8 text-left card-hover group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Fresh</h3>
              <p className="text-gray-600">Create a new resume from scratch with our guided builder</p>
              <div className="mt-4 text-sm text-gray-400">Full customization</div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Upload Screen
  if (importMode === "upload") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
          <button
            onClick={() => setImportMode("choose")}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-2">Upload Your Resume</h2>
            <p className="text-gray-600 mb-8">We&apos;ll extract all your information automatically</p>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`upload-zone rounded-2xl p-12 text-center cursor-pointer transition-all ${
                dragOver ? 'drag-over border-indigo-500 bg-indigo-50' : ''
              } ${uploading || parsing ? 'pointer-events-none opacity-50' : ''}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
              
              {uploading || parsing ? (
                <div className="space-y-4">
                  <Loader2 className="h-12 w-12 mx-auto text-indigo-500 animate-spin" />
                  <p className="text-gray-600">
                    {uploading ? 'Uploading...' : 'Parsing your resume with AI...'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-lg font-medium mb-2">
                    Drag & drop your resume here
                  </p>
                  <p className="text-gray-500 mb-4">or click to browse</p>
                  <p className="text-sm text-gray-400">PDF, DOCX, or TXT (max 5MB)</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Paste Screen
  if (importMode === "paste") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <button
            onClick={() => setImportMode("choose")}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-2">Paste Your Resume</h2>
            <p className="text-gray-600 mb-6">Copy your resume content and paste it below</p>

            <Textarea
              placeholder="Paste your resume text here...

Example:
John Doe
john@email.com | (555) 123-4567 | New York, NY

SUMMARY
Experienced software engineer with 5+ years...

EXPERIENCE
Senior Developer at Tech Corp
Jan 2020 - Present
• Led development of..."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="min-h-[300px] mb-6 text-sm"
            />

            <div className="flex gap-4">
              <Button
                onClick={() => parseResumeText(pasteText)}
                disabled={!pasteText.trim() || parsing}
                className="flex-1"
              >
                {parsing ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Parsing...</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" /> Parse Resume</>
                )}
              </Button>
              <Button variant="outline" onClick={() => setImportMode(null)}>
                Skip & Enter Manually
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Builder UI
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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">Resume Builder</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setShowPreview(!showPreview)}
              className="rounded-full"
            >
              {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPreview ? "Hide Preview" : "Preview"}
            </Button>
            <Link href={{
              pathname: "/scorer",
              query: { resume: encodeURIComponent(generateResumeText()), jd: encodeURIComponent(jobDescription) }
            }}>
              <Button className="rounded-full">
                Check ATS Score
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className={`grid ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-8`}>
          
          {/* Sidebar - Job Analysis */}
          {!showPreview && (
            <div className="lg:col-span-1 space-y-6">
              <div className="glass rounded-2xl p-6 sticky top-24">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  Job Description
                </h3>
                <Textarea
                  placeholder="Paste the job description here to get AI-powered optimization suggestions..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[180px] mb-4"
                />
                <Button 
                  onClick={analyzeJob} 
                  disabled={analyzing || !jobDescription.trim()}
                  className="w-full rounded-xl"
                >
                  {analyzing ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Sparkles className="h-4 w-4 mr-2" /> Analyze Job</>
                  )}
                </Button>

                {jobAnalysis && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">ATS Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {jobAnalysis.atsKeywords.slice(0, 10).map((kw, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (!resume.skills.includes(kw)) {
                                setResume(prev => ({ ...prev, skills: [...prev.skills, kw] }))
                              }
                            }}
                            className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full hover:bg-indigo-200 transition"
                          >
                            + {kw}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Experience Level</h4>
                      <p className="text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-2">
                        {jobAnalysis.experienceLevel}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Form */}
          <div className={showPreview ? 'lg:col-span-1' : 'lg:col-span-2'}>
            <div className="space-y-6">
              
              {/* Personal Info */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    value={resume.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={resume.personalInfo.email}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  />
                  <Input
                    placeholder="Phone"
                    value={resume.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  />
                  <Input
                    placeholder="Location (City, State)"
                    value={resume.personalInfo.location}
                    onChange={(e) => updatePersonalInfo("location", e.target.value)}
                  />
                  <Input
                    placeholder="LinkedIn URL (optional)"
                    value={resume.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                  />
                  <Input
                    placeholder="Portfolio/Website (optional)"
                    value={resume.personalInfo.website}
                    onChange={(e) => updatePersonalInfo("website", e.target.value)}
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Professional Summary</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={optimizing === 'summary' || !resume.summary.trim()}
                    onClick={async () => {
                      const optimized = await optimizeSection('summary', resume.summary)
                      if (optimized) setResume(prev => ({ ...prev, summary: optimized }))
                    }}
                    className="rounded-full"
                  >
                    {optimizing === 'summary' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <><Sparkles className="h-4 w-4 mr-1" /> Optimize</>
                    )}
                  </Button>
                </div>
                <Textarea
                  placeholder="Write a brief professional summary highlighting your key qualifications..."
                  value={resume.summary}
                  onChange={(e) => setResume(prev => ({ ...prev, summary: e.target.value }))}
                  className="min-h-[120px]"
                />
              </div>

              {/* Experience */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Work Experience</h3>
                  <Button variant="outline" size="sm" onClick={addExperience} className="rounded-full">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-6">
                  {resume.experience.map((exp, index) => (
                    <div key={exp.id} className="p-4 bg-gray-50 rounded-xl space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">Position {index + 1}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={optimizing === `exp-${exp.id}` || !exp.description.trim()}
                            onClick={async () => {
                              const optimized = await optimizeSection('work experience', exp.description)
                              if (optimized) updateExperience(exp.id, "description", optimized)
                            }}
                            className="rounded-full"
                          >
                            {optimizing === `exp-${exp.id}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}
                          </Button>
                          {resume.experience.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(exp.id)}
                              className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Job Title"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                        />
                        <Input
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        />
                        <Input
                          placeholder="Start Date (e.g., Jan 2022)"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                        />
                        <div className="flex gap-2 items-center">
                          <Input
                            placeholder="End Date"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                            disabled={exp.current}
                            className="flex-1"
                          />
                          <label className="flex items-center gap-2 whitespace-nowrap text-sm">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                              className="rounded"
                            />
                            Current
                          </label>
                        </div>
                      </div>
                      <Textarea
                        placeholder="Describe your responsibilities and achievements..."
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Education</h3>
                  <Button variant="outline" size="sm" onClick={addEducation} className="rounded-full">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-6">
                  {resume.education.map((edu, index) => (
                    <div key={edu.id} className="p-4 bg-gray-50 rounded-xl space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">Education {index + 1}</span>
                        {resume.education.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(edu.id)}
                            className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                        />
                        <Input
                          placeholder="Degree (e.g., Bachelor's)"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        />
                        <Input
                          placeholder="Field of Study"
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                        />
                        <Input
                          placeholder="GPA (optional)"
                          value={edu.gpa}
                          onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                        />
                        <Input
                          placeholder="Start Date"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                        />
                        <Input
                          placeholder="End Date"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Skills</h3>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add a skill..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1"
                  />
                  <Button onClick={addSkill} variant="outline" className="rounded-xl">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Certifications (Optional)</h3>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add a certification..."
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                    className="flex-1"
                  />
                  <Button onClick={addCertification} variant="outline" className="rounded-xl">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume.certifications.map((cert, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {cert}
                      <button onClick={() => removeCertification(cert)} className="hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 sticky top-24">
                <h3 className="font-semibold mb-4">Live Preview</h3>
                <div className="bg-white border rounded-xl p-6 text-sm space-y-4 max-h-[70vh] overflow-y-auto shadow-inner">
                  {/* Header */}
                  <div className="text-center border-b pb-4">
                    <h1 className="text-xl font-bold text-gray-900">
                      {resume.personalInfo.fullName || "Your Name"}
                    </h1>
                    <p className="text-gray-600 text-xs mt-1">
                      {[resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.location]
                        .filter(Boolean).join(" • ")}
                    </p>
                  </div>

                  {/* Summary */}
                  {resume.summary && (
                    <div>
                      <h2 className="font-bold text-xs uppercase tracking-wider text-indigo-600 mb-1">Summary</h2>
                      <p className="text-gray-600 text-xs leading-relaxed">{resume.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {resume.experience.some(e => e.company) && (
                    <div>
                      <h2 className="font-bold text-xs uppercase tracking-wider text-indigo-600 mb-2">Experience</h2>
                      {resume.experience.filter(e => e.company).map((exp, i) => (
                        <div key={i} className="mb-3">
                          <div className="flex justify-between">
                            <span className="font-semibold text-xs">{exp.position}</span>
                            <span className="text-gray-400 text-xs">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs">{exp.company}</p>
                          <p className="text-gray-600 text-xs mt-1 leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {resume.education.some(e => e.institution) && (
                    <div>
                      <h2 className="font-bold text-xs uppercase tracking-wider text-indigo-600 mb-2">Education</h2>
                      {resume.education.filter(e => e.institution).map((edu, i) => (
                        <div key={i} className="mb-2">
                          <div className="flex justify-between">
                            <span className="font-semibold text-xs">{edu.degree} in {edu.field}</span>
                            <span className="text-gray-400 text-xs">{edu.endDate}</span>
                          </div>
                          <p className="text-gray-500 text-xs">{edu.institution}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {resume.skills.length > 0 && (
                    <div>
                      <h2 className="font-bold text-xs uppercase tracking-wider text-indigo-600 mb-1">Skills</h2>
                      <p className="text-gray-600 text-xs">{resume.skills.join(" • ")}</p>
                    </div>
                  )}

                  {/* Certifications */}
                  {resume.certifications.length > 0 && (
                    <div>
                      <h2 className="font-bold text-xs uppercase tracking-wider text-indigo-600 mb-1">Certifications</h2>
                      <p className="text-gray-600 text-xs">{resume.certifications.join(" • ")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
