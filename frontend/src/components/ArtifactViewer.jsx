import React from 'react'

function safeParse(content) {
  try {
    return JSON.parse(content)
  } catch {
    return null
  }
}

function FunctionalRequirements({ data }) {
  return (
    <div className="space-y-3">
      {data.map((fr) => (
        <div key={fr.id} className="bg-card border border-bordercol rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary bg-blue-50 px-2 py-0.5 rounded">{fr.id}</span>
            <h4 className="font-medium text-textmain">{fr.title}</h4>
          </div>
          <p className="text-sm text-textmain/70">{fr.description}</p>
        </div>
      ))}
    </div>
  )
}

function NonFunctionalRequirements({ data }) {
  return (
    <div className="space-y-3">
      {data.map((nfr) => (
        <div key={nfr.id} className="bg-card border border-bordercol rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary bg-blue-50 px-2 py-0.5 rounded">{nfr.id}</span>
            <span className="text-xs font-medium text-textmain/60 uppercase">{nfr.category}</span>
          </div>
          <p className="text-sm text-textmain/70">{nfr.description}</p>
        </div>
      ))}
    </div>
  )
}

function UserStories({ data }) {
  return (
    <div className="space-y-3">
      {data.map((us) => (
        <div key={us.id} className="bg-card border border-bordercol rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary bg-blue-50 px-2 py-0.5 rounded">{us.id}</span>
            <span className="text-xs font-medium text-textmain/60">{us.actor}</span>
          </div>
          <p className="text-sm text-textmain mb-2">{us.story}</p>
          {us.acceptance_criteria?.length > 0 && (
            <ul className="list-disc list-inside text-xs text-textmain/60 space-y-1">
              {us.acceptance_criteria.map((ac, i) => <li key={i}>{ac}</li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}

function UseCases({ data }) {
  return (
    <div className="space-y-4">
      {data.map((uc) => (
        <div key={uc.id} className="bg-card border border-bordercol rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-primary bg-blue-50 px-2 py-0.5 rounded">{uc.id}</span>
            <h4 className="font-medium text-textmain">{uc.name}</h4>
          </div>
          <p className="text-xs text-textmain/60 mb-2">Actors: {uc.actors?.join(', ')}</p>
          <div className="grid md:grid-cols-2 gap-3 text-xs">
            <div>
              <p className="font-semibold text-textmain/70 mb-1">Preconditions</p>
              <ul className="list-disc list-inside text-textmain/60 space-y-0.5">
                {uc.preconditions?.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-textmain/70 mb-1">Postconditions</p>
              <ul className="list-disc list-inside text-textmain/60 space-y-0.5">
                {uc.postconditions?.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>
          <div className="mt-2">
            <p className="font-semibold text-textmain/70 text-xs mb-1">Main Flow</p>
            <ol className="list-decimal list-inside text-xs text-textmain/60 space-y-0.5">
              {uc.main_flow?.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
          {uc.alternate_flows?.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold text-textmain/70 text-xs mb-1">Alternate Flows</p>
              <ul className="list-disc list-inside text-xs text-textmain/60 space-y-0.5">
                {uc.alternate_flows.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function DatabaseSchema({ data }) {
  return (
    <div className="space-y-4">
      {data.map((table) => (
        <div key={table.name} className="bg-card border border-bordercol rounded-lg overflow-hidden">
          <div className="bg-primary/5 px-4 py-2 border-b border-bordercol">
            <h4 className="font-semibold text-textmain text-sm">{table.name}</h4>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-textmain/50 border-b border-bordercol">
                <th className="px-4 py-2">Column</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Constraints</th>
              </tr>
            </thead>
            <tbody>
              {table.columns?.map((col, i) => (
                <tr key={i} className="border-b border-bordercol last:border-0">
                  <td className="px-4 py-2 font-medium text-textmain">{col.name}</td>
                  <td className="px-4 py-2 text-textmain/60">{col.type}</td>
                  <td className="px-4 py-2 text-textmain/60">{col.constraints}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {table.relationships?.length > 0 && (
            <div className="px-4 py-2 border-t border-bordercol bg-background text-xs text-textmain/60">
              {table.relationships.map((rel, i) => (
                <p key={i}>{rel.type} → {rel.with_table}: {rel.description}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const methodColors = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-yellow-100 text-yellow-700',
  PATCH: 'bg-orange-100 text-orange-700',
  DELETE: 'bg-red-100 text-red-700',
}

function ApiDesign({ data }) {
  return (
    <div className="space-y-2">
      {data.map((ep, i) => (
        <div key={i} className="bg-card border border-bordercol rounded-lg p-3 flex items-start gap-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded ${methodColors[ep.method] || 'bg-gray-100 text-gray-700'}`}>
            {ep.method}
          </span>
          <div className="flex-1">
            <p className="text-sm font-mono text-textmain">{ep.path}</p>
            <p className="text-xs text-textmain/60 mt-0.5">{ep.description}</p>
          </div>
          {ep.auth_required && (
            <span className="text-xs text-textmain/40">🔒 Auth</span>
          )}
        </div>
      ))}
    </div>
  )
}

const priorityColors = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
}

function SprintPlanning({ data }) {
  return (
    <div className="space-y-4">
      {data.map((sprint) => (
        <div key={sprint.sprint_number} className="bg-card border border-bordercol rounded-lg p-4">
          <h4 className="font-semibold text-textmain mb-1">Sprint {sprint.sprint_number} ({sprint.duration})</h4>
          <p className="text-sm text-textmain/60 mb-3">{sprint.goal}</p>
          <div className="space-y-1.5">
            {sprint.tasks?.map((task, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-background rounded px-3 py-2">
                <span className="text-textmain">{task.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-textmain/50">{task.related_fr}</span>
                  <span className={`px-2 py-0.5 rounded font-medium ${priorityColors[task.priority] || ''}`}>{task.priority}</span>
                  <span className="text-textmain/50">{task.story_points} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function SoftwareArchitecture({ data }) {
  return (
    <div className="space-y-4">
      <div className="bg-card border border-bordercol rounded-lg p-4">
        <h4 className="font-semibold text-textmain mb-1">{data.style}</h4>
        <p className="text-sm text-textmain/60">{data.description}</p>
      </div>
      {data.layers?.map((layer, i) => (
        <div key={i} className="bg-card border border-bordercol rounded-lg p-4">
          <h5 className="font-medium text-textmain text-sm mb-1">{layer.name}</h5>
          <p className="text-xs text-textmain/60 mb-2">{layer.responsibility}</p>
          <div className="flex flex-wrap gap-1.5">
            {layer.technologies?.map((tech, j) => (
              <span key={j} className="text-xs bg-blue-50 text-primary px-2 py-0.5 rounded">{tech}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ProjectModules({ data }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {data.map((mod, i) => (
        <div key={i} className="bg-card border border-bordercol rounded-lg p-4">
          <h5 className="font-medium text-textmain text-sm mb-1">{mod.name}</h5>
          <p className="text-xs text-textmain/60 mb-2">{mod.description}</p>
          <ul className="list-disc list-inside text-xs text-textmain/50 space-y-0.5">
            {mod.components?.map((c, j) => <li key={j}>{c}</li>)}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function ArtifactViewer({ artifactType, content }) {
  const data = safeParse(content)

  if (data === null) {
    return <pre className="text-xs whitespace-pre-wrap bg-card border border-bordercol rounded-lg p-4">{content}</pre>
  }

  switch (artifactType) {
    case 'functional_requirements':
      return <FunctionalRequirements data={data} />
    case 'non_functional_requirements':
      return <NonFunctionalRequirements data={data} />
    case 'user_stories':
      return <UserStories data={data} />
    case 'use_cases':
      return <UseCases data={data} />
    case 'database_schema':
      return <DatabaseSchema data={data} />
    case 'api_design':
      return <ApiDesign data={data} />
    case 'sprint_planning':
      return <SprintPlanning data={data} />
    case 'software_architecture':
      return <SoftwareArchitecture data={data} />
    case 'project_modules':
      return <ProjectModules data={data} />
    default:
      return <pre className="text-xs whitespace-pre-wrap bg-card border border-bordercol rounded-lg p-4">{JSON.stringify(data, null, 2)}</pre>
  }
}
