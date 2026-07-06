import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  {
    title: 'Functional & Non-Functional Requirements',
    desc: 'Automatically generated from your natural language software requirements.'
  },
  {
    title: 'User Stories & Use Cases',
    desc: 'Generates user stories, actors, scenarios, and detailed use cases.'
  },
  {
    title: 'Database Schema',
    desc: 'Creates a structured database design with entities, attributes, and relationships.'
  },
  {
    title: 'ER Diagrams',
    desc: 'Automatically generates Entity Relationship Diagrams using Mermaid.js.'
  },
  {
    title: 'AI-Powered Analysis',
    desc: 'Uses Large Language Models to analyze requirements and generate software artifacts.'
  },
  {
    title: 'One-Click PDF Export',
    desc: 'Export all generated artifacts into a professional PDF document.'
  }
]
export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <nav className="h-14 border-b border-bordercol bg-card flex items-center justify-between px-6">
        <span className="font-semibold text-textmain text-lg">
          AI<span className="text-primary">RE</span> Platform
        </span>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="text-sm bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm text-textmain hover:text-primary">Login</Link>
              <Link to="/register" className="text-sm bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="max-w-4xl mx-auto text-center py-24 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-textmain leading-tight">
          AI-Assisted Requirement Engineering & Automated Design Generation
        </h1>
        <p className="mt-5 text-lg text-textmain/60 max-w-2xl mx-auto">
         Convert natural language software requirements into Functional Requirements,
Non-Functional Requirements, User Stories, Use Cases, Database Schemas, and
ER Diagrams using Large Language Models.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to={user ? '/dashboard' : '/register'}
            className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700"
          >
            {user ? 'Open Dashboard' : 'Start Free'}
          </Link>
          <Link
            to={user ? '/create-project' : '/login'}
            className="border border-bordercol text-textmain px-6 py-3 rounded-md font-medium hover:bg-card"
          >
            {user ? 'New Project' : 'Login'}
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-card border border-bordercol rounded-xl p-6">
              <h3 className="font-semibold text-textmain mb-2">{f.title}</h3>
              <p className="text-sm text-textmain/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-bordercol py-6 text-center text-xs text-textmain/40">
       AI-Assisted Requirement Engineering and Preliminary System Design Using Large Language Models
      </footer>
    </div>
  )
}
