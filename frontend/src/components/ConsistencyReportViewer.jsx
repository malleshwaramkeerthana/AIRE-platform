import React from 'react'

function safeParse(content, fallback) {
  try {
    return JSON.parse(content)
  } catch {
    return fallback
  }
}

export default function ConsistencyReportViewer({ report }) {
  if (!report) {
    return <p className="text-sm text-textmain/60">Consistency report not available yet.</p>
  }

  const entities = safeParse(report.extracted_entities, [])
  const mapping = safeParse(report.artifact_mapping, {})
  const missing = safeParse(report.missing_entities, [])
  const relValidation = safeParse(report.relationship_validation, {})

  const scoreColor = report.score >= 80 ? 'text-green-600' : report.score >= 50 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="space-y-5">
      <div className="bg-card border border-bordercol rounded-lg p-5 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-textmain">Overall Consistency Score</h4>
          <p className="text-xs text-textmain/60 mt-1">
            Measures whether extracted entities are consistently represented across all generated artifacts.
          </p>
        </div>
        <div className={`text-3xl font-bold ${scoreColor}`}>{report.score}%</div>
      </div>

      <div className="bg-card border border-bordercol rounded-lg p-4">
        <h5 className="font-medium text-textmain text-sm mb-3">Entity Coverage</h5>
        <div className="space-y-1.5">
          {entities.map((entity) => (
            <div key={entity} className="flex items-center justify-between text-xs bg-background rounded px-3 py-2">
              <span className="text-textmain">{entity}</span>
              <span className={mapping[entity] ? 'text-green-600' : 'text-red-600'}>
                {mapping[entity] ? '✓ Covered' : '✗ Missing'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {missing.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h5 className="font-medium text-red-700 text-sm mb-2">Missing Entities</h5>
          <ul className="list-disc list-inside text-xs text-red-600 space-y-0.5">
            {missing.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>
      )}

      <div className="bg-card border border-bordercol rounded-lg p-4">
        <h5 className="font-medium text-textmain text-sm mb-2">Relationship Validation</h5>
        <p className="text-xs text-textmain/60 mb-2">
          Total relationships checked: {relValidation.total_relationships_checked ?? 0}
        </p>
        {relValidation.valid ? (
          <p className="text-xs text-green-600">✓ All schema relationships reference valid tables.</p>
        ) : (
          <ul className="list-disc list-inside text-xs text-red-600 space-y-0.5">
            {(relValidation.issues || []).map((issue, i) => <li key={i}>{issue}</li>)}
          </ul>
        )}
      </div>
    </div>
  )
}
