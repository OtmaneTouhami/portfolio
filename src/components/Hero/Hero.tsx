import { profile } from "../../data/profile";
import { timeline } from "../../data/timeline";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa6";
import ParticlesBackground from "../ParticlesBackground";
import { BsArrowDown } from "react-icons/bs";
import { motion } from "framer-motion";
import { scrollToId } from "../../lib/scrollToId";

export default function Hero() {
  const summaryLines = profile.bio.split("\n").filter(Boolean);
  const currentStudy = timeline.find(
    (item) => item.type === "education" && item.end === "Present"
  );
  const highlights = [
    currentStudy
      ? `${currentStudy.title} @ ${currentStudy.org} (${currentStudy.start} – ${currentStudy.end})`
      : undefined,
    "Open to 2025 software engineering internships",
  ].filter(Boolean) as string[];

  return (
    <section id="hero" className="section-full bg-black">
      <ParticlesBackground />
      <div className="container-px pointer-events-auto relative z-10 mx-auto flex max-w-4xl items-center justify-center">
        <motion.div
          className="flex w-full flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              {profile.name}
            </h1>
            <p className="text-sm font-medium text-accent sm:text-base">
              {profile.title}
            </p>
          </motion.div>

          <motion.p
            className="max-w-2xl text-sm leading-relaxed text-neutral-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {summaryLines.join(" ")}
          </motion.p>

          {highlights.length > 0 && (
            <motion.div
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded border border-neutral-800 bg-neutral-900/50 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-neutral-300"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          )}

          <motion.div
            className="flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              onClick={() => scrollToId("contact")}
              className="rounded bg-cyan-500 px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-cyan-400"
            >
              Let's Connect
            </button>
            <button
              onClick={() => scrollToId("projects")}
              className="rounded border border-neutral-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:border-cyan-500 hover:text-cyan-400"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToId("resume")}
              className="flex items-center gap-1.5 rounded border border-neutral-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:border-cyan-500 hover:text-cyan-400"
            >
              <BsArrowDown className="text-xs" />
              Resume
            </button>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {profile.socials.github && (
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                className="rounded border border-neutral-800 p-2 text-neutral-400 transition-colors hover:border-cyan-500 hover:text-cyan-400"
                aria-label="GitHub"
              >
                <FaGithub className="text-base" />
              </a>
            )}
            {profile.socials.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded border border-neutral-800 p-2 text-neutral-400 transition-colors hover:border-cyan-500 hover:text-cyan-400"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-base" />
              </a>
            )}
            {profile.socials.email && (
              <a
                href={profile.socials.email}
                target="_blank"
                rel="noreferrer"
                className="rounded border border-neutral-800 p-2 text-neutral-400 transition-colors hover:border-cyan-500 hover:text-cyan-400"
                aria-label="Email"
              >
                <FaEnvelope className="text-base" />
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
