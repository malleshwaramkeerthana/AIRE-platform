import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import { useAuth } from '../context/AuthContext'
import { listProjects } from '../api/projects'

export default function Profile() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total: 0, completed: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listProjects()
      .then((res) => {
        const projects = res.data.projects
        setStats({
          total: projects.length,
          completed: projects.filter((p) => p.status === 'completed').length,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-textmain mb-6">User Profile</h1>

        <div className="bg-card border border-bordercol rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-textmain">{user?.full_name}</h2>
              <p className="text-sm text-textmain/60">{user?.email}</p>
              <p className="text-xs text-textmain/40 mt-1">
                Member since {new Date(user?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-bordercol rounded-xl p-6">
          <h3 className="font-semibold text-textmain mb-4">Activity</h3>
          {loading ? (
            <Loader label="Loading stats..." />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-textmain">{stats.total}</p>
                <p className="text-xs text-textmain/50 mt-1">Total Projects</p>
              </div>
              <div className="bg-background rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary">{stats.completed}</p>
                <p className="text-xs text-textmain/50 mt-1">Completed</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
