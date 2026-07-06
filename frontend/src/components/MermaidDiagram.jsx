import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
  theme: "default",
  themeVariables: {
    primaryColor: "#2563EB",
    primaryTextColor: "#0F172A",
    primaryBorderColor: "#2563EB",
    lineColor: "#94A3B8",
    background: "#FFFFFF",
  },
});

export default function MermaidDiagram({ code }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const renderDiagram = async () => {
      if (!code || !containerRef.current) return;

      try {
        setError(null);

        // Clear previous SVG
        containerRef.current.innerHTML = "";

        // Wait for React DOM to finish rendering
        await new Promise((resolve) => requestAnimationFrame(resolve));

        // Remove Mermaid's temporary nodes
        document
          .querySelectorAll('[id^="dmermaid-"]')
          .forEach((e) => e.remove());

        const id = `mermaid-${Date.now()}`;

        const { svg } = await mermaid.render(id, code);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Mermaid Error:", err);

        if (!cancelled) {
          setError(err.message || "Failed to render diagram");
        }
      }
    };

    // Small delay prevents first render failure
    const timer = setTimeout(() => {
      renderDiagram();
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [code]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
        <p className="font-medium mb-2">
          Diagram rendering error
        </p>

        <pre className="whitespace-pre-wrap text-xs">
          {error}
        </pre>

        <pre className="whitespace-pre-wrap text-xs mt-3 bg-white border rounded p-2">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div className="bg-card border border-bordercol rounded-lg p-4 overflow-auto">
      <div
        ref={containerRef}
        className="flex justify-center"
      />
    </div>
  );
}