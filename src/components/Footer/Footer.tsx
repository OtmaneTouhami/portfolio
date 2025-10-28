import { profile } from "../../data/profile";
import { FaGithub, FaLinkedin, FaEnvelope, FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <motion.footer
      className="bg-neutral-950 border-t border-neutral-800 py-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container-px mx-auto max-w-6xl">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Brand */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3">
              {profile.name}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {profile.title}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                "Hero",
                "Experience",
                "Education",
                "Certifications",
                "stack",
                "Projects",
                "Resume",
                "Contact",
              ].map((item) => (
                <li key={item}>
                  <button
                    className="text-neutral-400 hover:text-accent transition-colors"
                    onClick={() => scrollToId(item.toLowerCase())}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Connect</h4>
            <div className="space-y-3">
              {profile.socials.email && (
                <a
                  href={profile.socials.email}
                  className="flex items-center gap-2 text-xs text-neutral-400 hover:text-accent transition-colors"
                >
                  <FaEnvelope className="text-sm" />
                  Email
                </a>
              )}
              {profile.socials.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs text-neutral-400 hover:text-accent transition-colors"
                >
                  <FaGithub className="text-sm" />
                  GitHub
                </a>
              )}
              {profile.socials.linkedin && (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs text-neutral-400 hover:text-accent transition-colors"
                >
                  <FaLinkedin className="text-sm" />
                  LinkedIn
                </a>
              )}
              {profile.socials.x && (
                <a
                  href={profile.socials.x}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs text-neutral-400 hover:text-accent transition-colors"
                >
                  <FaXTwitter className="text-sm" />X (Twitter)
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-xs text-neutral-500">
            © {currentYear} {profile.name}. All rights reserved.
          </p>
          <p className="text-xs text-neutral-500">
            Built with React, TypeScript & Vite
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
