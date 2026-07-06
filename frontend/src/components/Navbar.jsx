import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="h-14 border-b border-bordercol bg-card flex items-center justify-between px-6">
      <Link to="/" className="font-semibold text-textmain text-lg">
        AI<span className="text-primary">RE</span> Platform
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <Link to="/dashboard" className="text-sm text-textmain hover:text-primary">Dashboard</Link>
            <Link to="/create-project" className="text-sm text-textmain hover:text-primary">New Project</Link>
            <Link to="/profile" className="text-sm text-textmain hover:text-primary">{user.full_name}</Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-primary text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
