import { timeline } from "../../data/timeline";
import { motion } from "framer-motion";

const timelineVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Education() {
  const education = timeline.filter((t) => t.type === "education");

  return (
    <section id="education" className="section-full bg-neutral-950">
      <motion.div
        className="container-px mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2
          className="section-heading mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Education
        </motion.h2>

        <motion.div className="relative space-y-4" variants={timelineVariants}>
          <div className="absolute left-2 top-0 bottom-0 w-px bg-neutral-800" />

          {education.map((item) => (
            <motion.div
              key={`${item.title}-${item.start}`}
              className="relative pl-8"
              variants={itemVariants}
            >
              <div className="absolute left-0 top-2 w-5 h-5 rounded-full border-2 border-cyan-500 bg-black" />

              <div className="card p-4">
                <div className="text-xs text-neutral-500 mb-1">
                  {item.start} — {item.end}
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-accent mb-1">{item.org}</p>
                {item.description && (
                  <p className="text-xs text-neutral-400">{item.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
