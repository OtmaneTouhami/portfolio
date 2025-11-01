import { developer, type StackIcon } from "../../data/developer-data";
import {
  SiAngular,
  SiDjango,
  SiExpress,
  SiFastapi,
  SiGraphql,
  SiLaravel,
  SiMariadb,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { FiCpu } from "react-icons/fi";
import { motion } from "framer-motion";

const iconMap: Record<StackIcon, IconType> = {
  typescript: SiTypescript,
  react: SiReact,
  nextjs: SiNextdotjs,
  angular: SiAngular,
  tailwind: SiTailwindcss,
  openjdk: SiOpenjdk,
  springboot: SiSpringboot,
  nodejs: SiNodedotjs,
  express: SiExpress,
  nestjs: SiNestjs,
  python: SiPython,
  php: SiPhp,
  fastapi: SiFastapi,
  django: SiDjango,
  laravel: SiLaravel,
  mariadb: SiMariadb,
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  graphql: SiGraphql,
};

const STACK_GROUPS = [
  {
    title: "Frontend",
    tone: "emerald",
    items: developer.stack.frontend,
  },
  {
    title: "Backend & Platforms",
    tone: "cyan",
    items: developer.stack.backend,
  },
] as const;

type StackGroupTone = (typeof STACK_GROUPS)[number]["tone"];

const toneStyles: Record<StackGroupTone, { icon: string; badge: string }> = {
  emerald: {
    icon: "text-emerald-300",
    badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  },
  cyan: {
    icon: "text-cyan-300",
    badge: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  },
};

const KIND_LABEL: Record<string, string> = {
  api: "API",
  database: "Database",
};

function formatKind(kind: string) {
  if (!kind) return "";
  if (KIND_LABEL[kind]) return KIND_LABEL[kind];
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export default function TechStack() {
  return (
    <section id="stack" className="section relative bg-neutral-950">
      <div className="container-px mx-auto flex min-h-[calc(100vh-2px)] max-w-6xl flex-col justify-center gap-5 pt-24 pb-12">
        <motion.header
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading mb-2">Tech Stack</h2>
        </motion.header>

        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12">
          {STACK_GROUPS.map((group) => (
            <motion.div
              key={group.title}
              className="flex w-full flex-col items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px", amount: 0.2 }}
            >
              <motion.div
                className={`mb-6 rounded-full border px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] ${
                  toneStyles[group.tone].badge
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
              >
                {group.title}
              </motion.div>

              <motion.div
                className="flex w-full max-w-5xl flex-wrap justify-center gap-4"
                variants={containerVariants}
              >
                {group.items.map((item) => {
                  const Icon = iconMap[item.icon] ?? FiCpu;
                  const tone = toneStyles[group.tone];
                  return (
                    <motion.div
                      key={`${group.title}-${item.name}`}
                      className="group flex w-full max-w-[190px] basis-1/2 items-center gap-3 rounded-xl border border-neutral-800/70 bg-neutral-900/70 px-4 py-3 shadow-md shadow-black/10 transition duration-200 hover:border-neutral-700 hover:bg-neutral-900 sm:basis-1/3 md:basis-1/4 lg:basis-[20%] xl:basis-[16.5%]"
                      variants={itemVariants}
                      whileHover={{
                        y: -5,
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800/90 text-xl transition-colors ${tone.icon} group-hover:text-white`}
                      >
                        <Icon aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-neutral-100">
                          {item.name}
                        </p>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                          {formatKind(item.kind)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
