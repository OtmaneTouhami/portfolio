import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { timeline } from "../../data/timeline";

export default function Timeline() {
  const [tab, setTab] = useState<"education" | "experience">("education");

  const groups = useMemo(() => {
    return {
      education: timeline.filter((t) => t.type === "education"),
      experience: timeline.filter((t) => t.type === "experience"),
    } as const;
  }, []);

  const items = tab === "education" ? groups.education : groups.experience;

  return (
    <section id="timeline" className="section-full bg-neutral-900">
      <div className="grid-pattern absolute inset-0 opacity-20" />
      <div className="container-px mx-auto max-w-5xl z-10">
        <h2 className="section-heading text-center mb-8">My Journey</h2>

        <div className="flex justify-center mb-10">
          <div className="inline-flex glass-card p-1">
            <button
              onClick={() => setTab("education")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                tab === "education"
                  ? "bg-violet-600 text-white shadow-lg"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              🎓 Education
            </button>
            <button
              onClick={() => setTab("experience")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                tab === "experience"
                  ? "bg-violet-600 text-white shadow-lg"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              💼 Experience
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 to-cyan-500 opacity-30" />
          
          <div className="space-y-8">
            {items.map((item, idx) => (
              <motion.div
                key={`${item.title}-${item.start}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative pl-20"
              >
                <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-violet-500 border-4 border-neutral-900 shadow-lg shadow-violet-500/50 pulse-glow" />
                
                <div className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/30 font-medium">
                      {item.start} — {item.end}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-violet-400 font-medium mb-3">{item.org}</p>
                  {item.description && (
                    <p className="text-neutral-400 leading-relaxed">{item.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
