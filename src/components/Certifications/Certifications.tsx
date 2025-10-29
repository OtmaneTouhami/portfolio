import { developer } from "../../data/developer-data";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Certifications() {
  const certs = developer.certifications;
  return (
    <section id="certifications" className="section-full bg-neutral-950">
      <motion.div
        className="container-px mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px", amount: 0.2 }}
      >
        <motion.h2
          className="section-heading mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          Certifications
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
        >
          {certs.map((c, idx) => (
            <motion.div
              key={`${c.name}-${idx}`}
              className="card p-5"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <h3 className="text-base font-semibold text-white mb-2">
                {c.name}
              </h3>
              <p className="text-xs text-neutral-400 mb-3">{c.issuer}</p>
              {c.verifyUrl ? (
                <a
                  href={c.verifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Verify
                </a>
              ) : (
                c.certificateId && (
                  <span className="text-xs text-neutral-500">
                    ID: {c.certificateId}
                  </span>
                )
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
