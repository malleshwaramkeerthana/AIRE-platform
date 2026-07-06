import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { createProject } from '../api/projects'

const EXAMPLE = `Build a Hospital Management System where patients can book appointments, doctors can manage schedules, administrators can manage users, and billing should be automated.`

export default function CreateProject() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', description: '', requirement_text: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleUseExample = () => {
    setForm({
      ...form,
      name: form.name || 'Hospital Management System',
      requirement_text: EXAMPLE,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await createProject(form)
      navigate(`/project/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create project.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-textmain mb-1">Create New Project</h1>
        <p className="text-sm text-textmain/60 mb-6">
          Describe your software system in natural language. Our AI agents will generate
          requirements, user stories, use cases, database schema, diagrams, API design,
          sprint plans, and a consistency report.
          Tip: Provide a detailed project description including modules, users, features, and workflow. More detailed requirements lead to higher-quality software design artifacts.
        </p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-bordercol rounded-xl p-6">
          <div>
            <label className="block text-sm font-medium text-textmain mb-1">Project Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border border-bordercol rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Hospital Management System"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textmain mb-1">Short Description (optional)</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-bordercol rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="One-line summary of the project"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-textmain">Software Requirements</label>
              <button type="button" onClick={handleUseExample} className="text-xs text-primary font-medium">
                Use example
              </button>
            </div>
            <textarea
              name="requirement_text"
              required
              rows={8}
              value={form.requirement_text}
              onChange={handleChange}
              className="w-full border border-bordercol rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Describe your software system requirements in plain English..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-md py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Generate Design'}
          </button>
          <p className="text-xs text-textmain/50 text-center">
            Generation runs in the background and may take a minute. You'll be redirected to the project workspace.
          </p>
        </form>
      </main>
    </div>
  )
}
