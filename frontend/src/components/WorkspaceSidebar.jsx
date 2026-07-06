import React from 'react'

const SECTIONS = [
  { key: 'functional_requirements', label: 'Functional Requirements' },
  { key: 'non_functional_requirements', label: 'Non-Functional Requirements' },
  { key: 'user_stories', label: 'User Stories' },
  { key: 'use_cases', label: 'Use Cases' },
  { key: 'database_schema', label: 'Database Schema' },
  { key: 'er_diagram', label: 'ER Diagram' },
 
]

export default function WorkspaceSidebar({ active, onSelect }) {
  return (
    <aside className="w-64 border-r border-bordercol bg-card h-full overflow-y-auto scrollbar-thin shrink-0">
      <nav className="py-3">
        {SECTIONS.map((section) => (
          <button
            key={section.key}
            onClick={() => onSelect(section.key)}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
              active === section.key
                ? 'bg-blue-50 text-primary font-medium border-r-2 border-primary'
                : 'text-textmain/70 hover:bg-background hover:text-textmain'
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export { SECTIONS }
