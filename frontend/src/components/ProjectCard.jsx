import React from 'react'
import { Link } from 'react-router-dom'

const statusColors = {
  draft: 'bg-gray-100 text-gray-600',
  processing: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
}

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/project/${project.id}`}
      className="block bg-card border border-bordercol rounded-xl p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-textmain text-base truncate pr-2">{project.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[project.status] || statusColors.draft}`}>
          {project.status}
        </span>
      </div>
      {project.description && (
        <p className="text-sm text-textmain/60 mt-2 line-clamp-2">{project.description}</p>
      )}
      <div className="flex items-center justify-between mt-4 text-xs text-textmain/50">
        <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
        <span className="font-medium text-primary">{project.consistency_score}% consistent</span>
      </div>
    </Link>
  )
}
