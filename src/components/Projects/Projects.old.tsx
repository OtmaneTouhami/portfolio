import { motion } from "framer-motion";
import { projects } from "../../data/projects";

export default function Projects() {
  return (
    <section
      id="projects"
      className="section-full bg-gradient-to-br from-neutral-900 via-violet-950/30 to-neutral-900"
    >
      <div className="grid-pattern absolute inset-0 opacity-10" />
      <div className="container-px mx-auto max-w-7xl z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-heading text-center mb-12"
        >
          Featured Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, idx) => (
            <motion.a
              key={p.name}
              href={p.github || p.demo || "#"}
              target={p.github || p.demo ? "_blank" : undefined}
              rel={p.github || p.demo ? "noreferrer" : undefined}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="project-card group"
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-300" />
                <div className="relative">
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-violet-400 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {(p.github || p.demo) && (
                    <div className="mt-6 flex items-center text-sm font-medium text-violet-400 group-hover:text-cyan-400 transition-colors">
                      <span>{p.demo ? "✨ Live Demo" : "🔗 View Code"}</span>
                      <svg
                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
