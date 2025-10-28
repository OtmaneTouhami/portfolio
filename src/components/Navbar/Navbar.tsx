import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "../../hooks/useAppStore";
import type { Mode } from "../../hooks/useAppStore";
import { clsx } from "clsx";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = { id: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "stack", label: "Tech Stack" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar() {
  const mode = useAppStore((s) => s.mode as Mode);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: [0.5], rootMargin: "-56px 0px 0px 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [mode]);

  const items = useMemo(() => NAV_ITEMS, []);

  const handleNavClick = (id: string) => {
    scrollToId(id);
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 border-b bg-black/90 backdrop-blur-sm border-neutral-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="container-px mx-auto flex h-14 items-center justify-between">
        <button
          onClick={() => handleNavClick("hero")}
          className="font-semibold text-base hover:text-accent transition-colors text-white"
          aria-label="Go to top"
        >
          otmane.dev
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToId(item.id)}
              className={clsx(
                "transition-colors relative font-medium",
                activeSection === item.id
                  ? "text-accent"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.span
                  className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-accent"
                  layoutId="activeSection"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:text-accent transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-neutral-800 bg-black/95 backdrop-blur-sm"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container-px mx-auto flex flex-col py-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={clsx(
                    "py-3 text-left text-sm font-medium transition-colors",
                    activeSection === item.id
                      ? "text-accent"
                      : "text-neutral-400 hover:text-white"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
export default Navbar;
