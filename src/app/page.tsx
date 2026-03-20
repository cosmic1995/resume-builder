"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Target, Sparkles, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">ResumeAI</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/builder">
              <Button variant="ghost">Builder</Button>
            </Link>
            <Link href="/scorer">
              <Button variant="ghost">ATS Scorer</Button>
            </Link>
            <Link href="/builder">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Build Resumes That Beat the Bots
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Our AI-powered resume builder analyzes job descriptions and optimizes your resume 
            to pass ATS systems and land more interviews.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/builder">
              <Button size="lg" className="text-lg px-8">
                <Sparkles className="mr-2 h-5 w-5" />
                Build Your Resume
              </Button>
            </Link>
            <Link href="/scorer">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Target className="mr-2 h-5 w-5" />
                Score Your Resume
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>1. Paste Job Description</CardTitle>
                <CardDescription>
                  Add the job posting you're applying to. Our AI extracts key requirements and skills.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>2. Build & Optimize</CardTitle>
                <CardDescription>
                  Create your resume with AI suggestions that naturally incorporate ATS keywords.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>3. Score & Improve</CardTitle>
                <CardDescription>
                  Get an instant ATS score with specific suggestions to boost your chances.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why ResumeAI?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "AI-powered keyword optimization",
              "Real-time ATS scoring",
              "Job description analysis",
              "Professional templates",
              "Export to PDF",
              "Save multiple resumes",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-blue-100 mb-8">
            Join thousands of job seekers who've optimized their resumes with ResumeAI
          </p>
          <Link href="/builder">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Building for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-white">
        <div className="container mx-auto text-center text-gray-600">
          <p>© 2026 ResumeAI. Built with ❤️ to help you get hired.</p>
        </div>
      </footer>
    </div>
  )
}
