import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import { getProjectHistory, getProjectWorkspace } from '../api/projects'

export default function ProjectHistory() {
  const { id } = useParams()
  const [history, setHistory] = useState([])
  const [projectName, setProjectName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [historyRes, workspaceRes] = await Promise.all([
          getProjectHistory(id),
          getProjectWorkspace(id),
        ])
        setHistory(historyRes.data)
        setProjectName(workspaceRes.data.project.name)
      } catch (err) {
        setError('Failed to load project history.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-4">
          <Link to={`/project/${id}`} className="text-sm text-primary font-medium">← Back to Workspace</Link>
        </div>
        <h1 className="text-2xl font-bold text-textmain mb-1">Project History</h1>
        <p className="text-sm text-textmain/60 mb-6">{projectName}</p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3 mb-4">{error}</div>}

        {loading ? (
          <Loader label="Loading history..." />
        ) : history.length === 0 ? (
          <p className="text-sm text-textmain/60">No history entries yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <div key={entry.id} className="bg-card border border-bordercol rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-textmain text-sm">{entry.action}</p>
                  <p className="text-xs text-textmain/40">{new Date(entry.created_at).toLocaleString()}</p>
                </div>
                {entry.details && <p className="text-xs text-textmain/60 mt-1">{entry.details}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
