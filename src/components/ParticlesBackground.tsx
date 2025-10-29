import { useEffect, useState, useId } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

interface ParticlesBackgroundProps {
  particleCount?: number;
}

export default function ParticlesBackground({
  particleCount,
}: ParticlesBackgroundProps) {
  const [init, setInit] = useState(false);
  const particlesId = useId();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);

    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!init) return null;

  const count = particleCount ?? (isMobile ? 15 : 25);

  return (
    <Particles
      id={particlesId}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: isMobile ? 30 : 60,
        interactivity: {
          events: {
            onHover: {
              enable: !isMobile,
              mode: "grab",
            },
          },
          modes: {
            grab: {
              distance: 120,
              links: {
                opacity: 0.4,
              },
            },
          },
        },
        particles: {
          color: {
            value: "#06b6d4",
          },
          links: {
            color: "#06b6d4",
            distance: isMobile ? 100 : 150,
            enable: true,
            opacity: 0.25,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: isMobile ? 0.5 : 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
            },
            value: count,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
