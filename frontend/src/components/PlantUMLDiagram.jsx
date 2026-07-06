import React, { useState } from "react";
import plantumlEncoder from "plantuml-encoder";

export default function PlantUMLDiagram({ code, title }) {
  const [imgError, setImgError] = useState(false);

  if (!code) return null;

  let imageUrl = null;

  try {
    const encoded = plantumlEncoder.encode(code);
    imageUrl = `https://www.plantuml.com/plantuml/svg/${encoded}`;
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="bg-card border border-bordercol rounded-lg p-4">
      {title && (
        <h4 className="text-sm font-semibold text-textmain mb-3">
          {title}
        </h4>
      )}

      {imageUrl && !imgError ? (
        <div className="overflow-x-auto flex justify-center">
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="text-red-500 text-sm">
          Failed to render diagram.
        </div>
      )}

      <details className="mt-3">
        <summary className="cursor-pointer text-blue-600">
          View PlantUML source
        </summary>

        <pre className="mt-2 text-xs whitespace-pre-wrap">
          {code}
        </pre>
      </details>
    </div>
  );
}