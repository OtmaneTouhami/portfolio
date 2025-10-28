import { resume } from "../../data/resume";
import { motion } from "framer-motion";

export default function Resume() {
  return (
    <section id="resume" className="section-full bg-neutral-900">
      <div className="grid-pattern absolute inset-0 opacity-20" />
      <div className="container-px mx-auto max-w-4xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12 text-center"
        >
          <div className="text-6xl mb-6">📝</div>
          <h2 className="text-4xl font-bold mb-4 gradient-text">Resume</h2>
          <p className="text-lg text-neutral-300 mb-8">
            Download my resume in your preferred language.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={resume.en.path}
              download
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-violet-600 text-white rounded-xl hover:bg-violet-500 hover:scale-105 transition-all duration-300 font-medium glow-accent"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {resume.en.label}
            </a>
            <a
              href={resume.fr.path}
              download
              className="inline-flex items-center justify-center px-8 py-4 glass-card hover:scale-105 transition-all duration-300 font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {resume.fr.label}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="absolute bottom-1/3 -right-32 w-64 h-64 rounded-full bg-cyan-600/10 blur-3xl" />
    </section>
  );
}
