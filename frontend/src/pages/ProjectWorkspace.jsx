import React, { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import WorkspaceSidebar from '../components/WorkspaceSidebar'
import ArtifactViewer from '../components/ArtifactViewer'
import MermaidDiagram from '../components/MermaidDiagram'
import Loader from '../components/Loader'
import { getProjectWorkspace, regenerateProject, exportProjectPdf } from '../api/projects'

const SECTION_LABELS = {
  functional_requirements: 'Functional Requirements',
  non_functional_requirements: 'Non-Functional Requirements',
  user_stories: 'User Stories',
  use_cases: 'Use Cases',
  database_schema: 'Database Schema',
  er_diagram: 'ER Diagram',

}

export default function ProjectWorkspace() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [active, setActive] = useState('functional_requirements')
  const [exporting, setExporting] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  const fetchWorkspace = useCallback(async () => {
    try {
      const res = await getProjectWorkspace(id)
      setData(res.data)
      setError('')
    } catch (err) {
      setError('Failed to load project workspace.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchWorkspace()
  }, [fetchWorkspace])

  // Poll while processing
  useEffect(() => {
    if (data?.project?.status === 'processing') {
      const interval = setInterval(fetchWorkspace, 5000)
      return () => clearInterval(interval)
    }
  }, [data?.project?.status, fetchWorkspace])

  const handleExportPdf = async () => {
    setExporting(true)
    try {
      const res = await exportProjectPdf(id)
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${data.project.name.replace(/\s+/g, '_')}_design_document.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      alert('Failed to export PDF.')
    } finally {
      setExporting(false)
    }
  }

  const handleRegenerate = async () => {
    if (!window.confirm('Regenerate all artifacts for this project? This will replace existing results.')) return
    setRegenerating(true)
    try {
      await regenerateProject(id)
      setLoading(true)
      await fetchWorkspace()
    } catch (err) {
      alert('Failed to start regeneration.')
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Loader label="Loading project workspace..." />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-10 text-center">
          <p className="text-red-600 mb-4">{error || 'Project not found.'}</p>
          <Link to="/dashboard" className="text-primary font-medium">← Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  const { project, artifacts, diagrams, consistency_report } = data
  const artifactMap = Object.fromEntries(artifacts.map((a) => [a.artifact_type, a]))
  const diagramMap = Object.fromEntries(diagrams.map((d) => [d.diagram_type, d]))

  const renderMain = () => {
  if (project.status === 'processing') {
    return <Loader label="AI agents are generating your artifacts... this may take a minute." />
  }

  if (project.status === 'draft') {
    return (
      <div className="text-center py-16">
        <p className="text-textmain/60 mb-4">
          Generation has not completed yet or failed.
        </p>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {regenerating ? 'Starting...' : 'Retry Generation'}
        </button>
      </div>
    )
  }

  if (active === 'er_diagram') {
    const d = diagramMap['er_diagram']

    return d ? (
      <MermaidDiagram code={d.content} />
    ) : (
      <p className="text-sm text-textmain/60">
        No ER diagram generated.
      </p>
    )
  }

  const artifact = artifactMap[active]

  if (!artifact) {
    return (
      <p className="text-sm text-textmain/60">
        No data generated.
      </p>
    )
  }

  return (
    <ArtifactViewer
      artifactType={artifact.artifact_type}
      content={artifact.content}
    />
  )
}

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />

      {/* Workspace header */}
      <div className="border-b border-bordercol bg-card px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-textmain">{project.name}</h1>
          <p className="text-xs text-textmain/50 mt-0.5">
            Created {new Date(project.created_at).toLocaleDateString()} · Status: {project.status}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRegenerate}
            disabled={regenerating || project.status === 'processing'}
            className="border border-bordercol px-3 py-2 rounded-md text-sm hover:bg-background disabled:opacity-50"
          >
            Regenerate
          </button>
          <button
            onClick={handleExportPdf}
            disabled={exporting || project.status !== 'completed'}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Workspace body */}
      <div className="flex flex-1 overflow-hidden">
        <WorkspaceSidebar active={active} onSelect={setActive} />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
          <h2 className="text-lg font-semibold text-textmain mb-4">{SECTION_LABELS[active]}</h2>
          {renderMain()}
        </main>
      </div>
    </div>
  )
}
