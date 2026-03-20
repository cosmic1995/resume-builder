"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Target, Sparkles, CheckCircle, Upload, Zap, Shield, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl animated-gradient flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">ResumeAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">How it Works</Link>
            <Link href="/scorer" className="text-gray-600 hover:text-gray-900 transition">ATS Scorer</Link>
          </nav>
          <Link href="/builder">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 rounded-full px-6">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Resume Builder
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Build Resumes That
              <span className="gradient-text block">Beat the Bots</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload your resume or start fresh. Our AI analyzes job descriptions and optimizes 
              your resume to pass ATS systems and land more interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/builder">
                <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 rounded-full px-8 py-6 text-lg glow-hover">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Resume
                </Button>
              </Link>
              <Link href="/scorer">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg border-2 hover:bg-gray-50">
                  <Target className="mr-2 h-5 w-5" />
                  Check ATS Score
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { number: "95%", label: "ATS Pass Rate" },
              { number: "10K+", label: "Resumes Optimized" },
              { number: "3x", label: "More Interviews" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600">Powerful features to create the perfect resume</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Smart Import",
                description: "Upload PDF, DOCX, or paste text. AI extracts all your details automatically.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Sparkles,
                title: "AI Optimization",
                description: "Get intelligent suggestions to improve each section based on the job description.",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: Target,
                title: "ATS Scoring",
                description: "Real-time scoring shows exactly how well your resume matches the job.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Keyword Analysis",
                description: "Identifies missing keywords and shows you exactly what to add.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: FileText,
                title: "Pro Templates",
                description: "ATS-friendly templates designed by HR professionals.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Shield,
                title: "Privacy First",
                description: "Your data stays yours. We never share or sell your information.",
                color: "from-slate-500 to-gray-600"
              },
            ].map((feature, i) => (
              <div key={i} className="glass rounded-2xl p-8 card-hover">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to your perfect resume</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Upload or Create",
                description: "Import your existing resume or start from scratch with our guided builder."
              },
              {
                step: "02",
                title: "Add Job Description",
                description: "Paste the job posting. AI analyzes requirements and identifies key skills."
              },
              {
                step: "03",
                title: "Optimize & Export",
                description: "Apply AI suggestions, check your ATS score, and download your perfect resume."
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-6xl font-bold gradient-text opacity-30 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="animated-gradient rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who&apos;ve optimized their resumes with ResumeAI
            </p>
            <Link href="/builder">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-semibold">
                Start Building for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">ResumeAI</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2026 ResumeAI. Built with ❤️ to help you get hired.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="#" className="hover:text-gray-900">Privacy</Link>
              <Link href="#" className="hover:text-gray-900">Terms</Link>
              <Link href="#" className="hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
