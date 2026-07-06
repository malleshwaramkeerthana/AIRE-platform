import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProjectCard from '../components/ProjectCard'
import Loader from '../components/Loader'
import { listProjects } from '../api/projects'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  const fetchProjects = async (searchTerm = '') => {
    setLoading(true)
    setError('')
    try {
      const res = await listProjects(searchTerm)
      setProjects(res.data.projects)
    } catch (err) {
      setError('Failed to load projects.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchProjects(search)
  }

  const recentProjects = projects.slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-textmain">Welcome back, {user?.full_name}</h1>
            <p className="text-sm text-textmain/60 mt-1">Here's an overview of your projects.</p>
          </div>
          <Link
            to="/create-project"
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            + Create Project
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-bordercol rounded-xl p-5">
            <p className="text-xs text-textmain/50 uppercase font-medium">Total Projects</p>
            <p className="text-3xl font-bold text-textmain mt-1">{projects.length}</p>
          </div>
          <div className="bg-card border border-bordercol rounded-xl p-5">
            <p className="text-xs text-textmain/50 uppercase font-medium">Completed</p>
            <p className="text-3xl font-bold text-textmain mt-1">
              {projects.filter((p) => p.status === 'completed').length}
            </p>
          </div>
          <div className="bg-card border border-bordercol rounded-xl p-5">
            <p className="text-xs text-textmain/50 uppercase font-medium">Processing</p>
            <p className="text-3xl font-bold text-textmain mt-1">
              {projects.filter((p) => p.status === 'processing').length}
            </p>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-bordercol rounded-md px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="bg-card border border-bordercol px-4 py-2 rounded-md text-sm hover:bg-background">
            Search
          </button>
        </form>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3 mb-4">{error}</div>}

        {loading ? (
          <Loader label="Loading projects..." />
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-card border border-bordercol rounded-xl">
            <p className="text-textmain/60 mb-4">You haven't created any projects yet.</p>
            <Link to="/create-project" className="text-primary font-medium">Create your first project →</Link>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-textmain mb-3">
              {search ? 'Search Results' : 'Recent Projects'}
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(search ? projects : recentProjects).map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
