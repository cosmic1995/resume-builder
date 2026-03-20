"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, ArrowLeft, Plus, Trash2, Sparkles, Loader2, 
  Download, Eye, ChevronDown, ChevronUp 
} from "lucide-react"
import type { Resume, Experience, Education, JobAnalysis } from "@/types/resume"

const emptyExperience: () => Experience = () => ({
  id: crypto.randomUUID(),
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  achievements: [""]
})

const emptyEducation: () => Education = () => ({
  id: crypto.randomUUID(),
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  gpa: ""
})

export default function BuilderPage() {
  const [step, setStep] = useState(1)
  const [jobDescription, setJobDescription] = useState("")
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [optimizing, setOptimizing] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  
  const [resume, setResume] = useState<Resume>({
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
  })

  const [skillInput, setSkillInput] = useState("")
  const [certInput, setCertInput] = useState("")

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
      setStep(2)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  const optimizeSection = async (section: string, content: string) => {
    if (!content.trim()) return
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

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, emptyExperience()]
    }))
  }

  const removeExperience = (id: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }))
  }

  const updateEducation = (id: string, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, emptyEducation()]
    }))
  }

  const removeEducation = (id: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  const addSkill = () => {
    if (skillInput.trim() && !resume.skills.includes(skillInput.trim())) {
      setResume(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const addCertification = () => {
    if (certInput.trim() && !resume.certifications.includes(certInput.trim())) {
      setResume(prev => ({
        ...prev,
        certifications: [...prev.certifications, certInput.trim()]
      }))
      setCertInput("")
    }
  }

  const removeCertification = (cert: string) => {
    setResume(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }))
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
      text += `${exp.description}\n`
      exp.achievements.forEach(a => text += `• ${a}\n`)
      text += `\n`
    })
    text += `EDUCATION\n`
    education.forEach(edu => {
      text += `${edu.degree} in ${edu.field}\n`
      text += `${edu.institution}, ${edu.startDate} - ${edu.endDate}\n`
      if (edu.gpa) text += `GPA: ${edu.gpa}\n`
      text += `\n`
    })
    text += `SKILLS\n${skills.join(', ')}\n`
    if (certifications.length > 0) {
      text += `\nCERTIFICATIONS\n${certifications.join('\n')}\n`
    }
    return text
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold">Resume Builder</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? "Hide" : "Preview"}
            </Button>
            <Link href={{
              pathname: "/scorer",
              query: { resume: encodeURIComponent(generateResumeText()), jd: encodeURIComponent(jobDescription) }
            }}>
              <Button>
                Score Resume
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className={`grid ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-8`}>
          {/* Sidebar - Job Analysis */}
          {!showPreview && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Job Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <Button 
                    onClick={analyzeJob} 
                    disabled={analyzing || !jobDescription.trim()}
                    className="w-full"
                  >
                    {analyzing ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
                    ) : (
                      <><Sparkles className="h-4 w-4 mr-2" /> Analyze Job</>
                    )}
                  </Button>

                  {jobAnalysis && (
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">ATS Keywords</h4>
                        <div className="flex flex-wrap gap-1">
                          {jobAnalysis.atsKeywords.map((kw, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full cursor-pointer hover:bg-blue-200"
                              onClick={() => {
                                if (!resume.skills.includes(kw)) {
                                  setResume(prev => ({
                                    ...prev,
                                    skills: [...prev.skills, kw]
                                  }))
                                }
                              }}
                            >
                              + {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Required Skills</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {jobAnalysis.requiredSkills.slice(0, 5).map((skill, i) => (
                            <li key={i}>• {skill}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Experience Level</h4>
                        <p className="text-sm text-gray-600">{jobAnalysis.experienceLevel}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Form */}
          <div className={showPreview ? 'lg:col-span-1' : 'lg:col-span-2'}>
            <div className="space-y-6">
              {/* Personal Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
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
                    placeholder="Website/Portfolio (optional)"
                    value={resume.personalInfo.website}
                    onChange={(e) => updatePersonalInfo("website", e.target.value)}
                  />
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Professional Summary</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={optimizing === 'summary' || !resume.summary.trim()}
                    onClick={async () => {
                      const optimized = await optimizeSection('summary', resume.summary)
                      if (optimized) setResume(prev => ({ ...prev, summary: optimized }))
                    }}
                  >
                    {optimizing === 'summary' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <><Sparkles className="h-4 w-4 mr-1" /> Optimize</>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write a brief professional summary highlighting your key qualifications and career goals..."
                    value={resume.summary}
                    onChange={(e) => setResume(prev => ({ ...prev, summary: e.target.value }))}
                    className="min-h-[120px]"
                  />
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Work Experience</CardTitle>
                  <Button variant="outline" size="sm" onClick={addExperience}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resume.experience.map((exp, index) => (
                    <div key={exp.id} className="space-y-4 pb-6 border-b last:border-0">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-500">Position {index + 1}</span>
                        {resume.experience.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExperience(exp.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
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
                        <div className="flex gap-2">
                          <Input
                            placeholder="End Date"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                            disabled={exp.current}
                          />
                          <label className="flex items-center gap-2 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-sm">Current</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Textarea
                          placeholder="Describe your responsibilities and achievements..."
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={optimizing === `exp-${exp.id}` || !exp.description.trim()}
                          onClick={async () => {
                            setOptimizing(`exp-${exp.id}`)
                            const optimized = await optimizeSection('work experience', exp.description)
                            if (optimized) updateExperience(exp.id, "description", optimized)
                            setOptimizing(null)
                          }}
                        >
                          {optimizing === `exp-${exp.id}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Education</CardTitle>
                  <Button variant="outline" size="sm" onClick={addEducation}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resume.education.map((edu, index) => (
                    <div key={edu.id} className="space-y-4 pb-6 border-b last:border-0">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-500">Education {index + 1}</span>
                        {resume.education.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeEducation(edu.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
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
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button onClick={addSkill} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="text-gray-400 hover:text-red-500">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Certifications (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a certification..."
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                    />
                    <Button onClick={addCertification} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resume.certifications.map((cert, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                      >
                        {cert}
                        <button onClick={() => removeCertification(cert)} className="text-gray-400 hover:text-red-500">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border rounded-lg p-6 text-sm space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Header */}
                    <div className="text-center border-b pb-4">
                      <h1 className="text-xl font-bold">{resume.personalInfo.fullName || "Your Name"}</h1>
                      <p className="text-gray-600 text-xs mt-1">
                        {[resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.location]
                          .filter(Boolean).join(" • ")}
                      </p>
                      {(resume.personalInfo.linkedin || resume.personalInfo.website) && (
                        <p className="text-gray-600 text-xs">
                          {[resume.personalInfo.linkedin, resume.personalInfo.website].filter(Boolean).join(" • ")}
                        </p>
                      )}
                    </div>

                    {/* Summary */}
                    {resume.summary && (
                      <div>
                        <h2 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-1">Summary</h2>
                        <p className="text-gray-600 text-xs">{resume.summary}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {resume.experience.some(e => e.company) && (
                      <div>
                        <h2 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-2">Experience</h2>
                        {resume.experience.filter(e => e.company).map((exp, i) => (
                          <div key={i} className="mb-3">
                            <div className="flex justify-between">
                              <span className="font-semibold text-xs">{exp.position}</span>
                              <span className="text-gray-500 text-xs">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs">{exp.company}</p>
                            <p className="text-gray-600 text-xs mt-1">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Education */}
                    {resume.education.some(e => e.institution) && (
                      <div>
                        <h2 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-2">Education</h2>
                        {resume.education.filter(e => e.institution).map((edu, i) => (
                          <div key={i} className="mb-2">
                            <div className="flex justify-between">
                              <span className="font-semibold text-xs">{edu.degree} in {edu.field}</span>
                              <span className="text-gray-500 text-xs">{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <p className="text-gray-600 text-xs">{edu.institution}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills */}
                    {resume.skills.length > 0 && (
                      <div>
                        <h2 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-1">Skills</h2>
                        <p className="text-gray-600 text-xs">{resume.skills.join(" • ")}</p>
                      </div>
                    )}

                    {/* Certifications */}
                    {resume.certifications.length > 0 && (
                      <div>
                        <h2 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-1">Certifications</h2>
                        <p className="text-gray-600 text-xs">{resume.certifications.join(" • ")}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
