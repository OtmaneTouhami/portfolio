import { useState, useMemo } from "react";
import { timeline } from "../../data/timeline";

export default function Timeline() {
  const [tab, setTab] = useState<"education" | "experience">("education");

  const groups = useMemo(() => {
    return {
      education: timeline.filter((t) => t.type === "education"),
      experience: timeline.filter((t) => t.type === "experience"),
    };
  }, []);

  const items = tab === "education" ? groups.education : groups.experience;

  return (
    <section id="timeline" className="section section-full bg-neutral-950">
      <div className="container-px mx-auto max-w-4xl h-full flex flex-col py-16">
        <h2 className="section-heading mb-4">Timeline</h2>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("education")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              tab === "education"
                ? "bg-cyan-500 text-black"
                : "bg-neutral-900 border border-neutral-800 hover:border-neutral-700"
            }`}
          >
            Education
          </button>
          <button
            onClick={() => setTab("experience")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              tab === "experience"
                ? "bg-cyan-500 text-black"
                : "bg-neutral-900 border border-neutral-800 hover:border-neutral-700"
            }`}
          >
            Experience
          </button>
        </div>

        <div className="relative space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-hide">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-neutral-800" />

          {items.map((item) => (
            <div key={`${item.title}-${item.start}`} className="relative pl-8">
              <div className="absolute left-0 top-2 w-5 h-5 rounded-full border-2 border-cyan-500 bg-black" />

              <div className="card p-3">
                <div className="text-xs text-neutral-500 mb-1">
                  {item.start} — {item.end}
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-accent mb-1">{item.org}</p>
                {item.description && (
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
