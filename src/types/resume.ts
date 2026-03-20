export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin?: string
  website?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
}

export interface Resume {
  id?: string
  userId?: string
  title: string
  personalInfo: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  certifications: string[]
  createdAt?: string
  updatedAt?: string
}

export interface ATSScore {
  overallScore: number
  keywordScore: number
  formatScore: number
  experienceScore: number
  missingKeywords: string[]
  suggestions: string[]
  strengths: string[]
}

export interface JobAnalysis {
  requiredSkills: string[]
  experienceLevel: string
  responsibilities: string[]
  atsKeywords: string[]
  niceToHave: string[]
}
