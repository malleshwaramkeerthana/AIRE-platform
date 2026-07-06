import React from 'react'

export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-8 h-8 border-4 border-bordercol border-t-primary rounded-full animate-spin"></div>
      <p className="text-sm text-textmain/70">{label}</p>
    </div>
  )
}
