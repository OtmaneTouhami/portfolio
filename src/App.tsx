import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import TechStack from "./components/TechStack/TechStack";
import Education from "./components/Education/Education";
import Experience from "./components/Experience/Experience";
import Certifications from "./components/Certifications/Certifications";
import Projects from "./components/Projects/Projects";
import Resume from "./components/Resume/Resume";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import CLI from "./components/CLI/CLI";
import { useAppStore } from "./hooks/useAppStore";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function App() {
  const mode = useAppStore((s) => s.mode);
  const setMode = useAppStore((s) => s.setMode);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // Track scroll progress with throttled native scroll
    let ticking = false;
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only update if scroll changed by more than 10px
      if (Math.abs(currentScrollY - lastScrollY) < 10) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = currentScrollY;
          const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? scrollTop / docHeight : 0;
          setScrollProgress(progress);
          setShowBackToTop(scrollTop > 300);
          lastScrollY = scrollTop;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {mode !== "cli" && (
        <>
          <Navbar />
          {/* Scroll progress indicator */}
          <div className="fixed top-0 left-0 right-0 h-0.5 z-[100] bg-neutral-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-150"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </>
      )}
      <AnimatePresence mode="wait">
        {mode === "cli" ? (
          <motion.div
            key="cli"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CLI />
          </motion.div>
        ) : (
          <motion.main
            key="gui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero />
            <Experience />
            <Education />
            <Certifications />
            <TechStack />
            <Projects />
            <Resume />
            <Contact />
            <Footer />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Fixed buttons - bottom right */}
      {mode !== "cli" && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
          {/* Back to top button */}
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 bg-neutral-900 border border-neutral-700 text-white hover:border-cyan-500"
              aria-label="Back to top"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </button>
          )}

          {/* CLI mode button */}
          <button
            onClick={() => setMode("cli")}
            className="p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 bg-cyan-500 text-black hover:bg-cyan-400"
            aria-label="Switch to CLI mode"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
