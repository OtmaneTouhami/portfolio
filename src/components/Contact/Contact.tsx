import { useState } from "react";
import emailjs from "@emailjs/browser";
import { profile } from "../../data/profile";
import ParticlesBackground from "../ParticlesBackground";
import { motion } from "framer-motion";

export default function Contact() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const message = formData.get("message")?.toString() || "";

    try {
      setLoading(true);
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { name, email, message },
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      );
      setStatus("✓ Sent successfully");
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("✗ Failed to send");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="section-full bg-black">
      <ParticlesBackground />
      <motion.div
        className="container-px mx-auto max-w-2xl relative z-10 pointer-events-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="card p-6 sm:p-8">
          <motion.h2
            className="section-heading mb-2"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Contact
          </motion.h2>
          <motion.p
            className="text-sm text-neutral-400 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Get in touch via the form below or reach out directly.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {profile.socials.email && (
              <a
                href={profile.socials.email}
                className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-800 rounded text-xs font-medium hover:border-cyan-500 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email
              </a>
            )}
            {profile.socials.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-black rounded text-xs font-medium hover:bg-cyan-400 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            )}
          </motion.div>

          <motion.form
            onSubmit={onSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Name
              </label>
              <input
                name="name"
                required
                className="w-full rounded bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-600 focus-ring"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-600 focus-ring"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={4}
                className="w-full rounded bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-600 focus-ring resize-none"
                placeholder="Your message..."
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                disabled={loading}
                className="px-5 py-2.5 bg-cyan-500 text-black rounded text-sm font-medium hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Sending..." : "Send"}
              </button>
              {status && (
                <span
                  className={`text-xs font-medium ${
                    status.includes("✓") ? "text-cyan-400" : "text-red-400"
                  }`}
                >
                  {status}
                </span>
              )}
            </div>
          </motion.form>
        </div>
      </motion.div>
    </section>
  );
}
