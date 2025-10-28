import { profile } from "../../data/profile";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="section-full bg-neutral-900">
      <div className="grid-pattern absolute inset-0 opacity-20" />
      <div className="container-px mx-auto max-w-5xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-12"
        >
          <h2 className="section-heading">About Me</h2>
          <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed">
            {profile.bio}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="inline-flex items-center justify-center px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-500 hover:scale-105 transition-all duration-300 font-medium"
            >
              🚀 View My Work
            </a>
            {profile.socials.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 glass-card hover:scale-105 transition-all duration-300 font-medium"
              >
                👋 Connect on LinkedIn
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full bg-cyan-600/10 blur-3xl" />
    </section>
  );
}
