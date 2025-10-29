const NAV_BAR_SELECTOR = "[data-nav-bar]";
const EXTRA_OFFSET = 12;

// Smoothly scroll to a section while accounting for the fixed navbar height.
export function scrollToId(id: string) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const target = document.getElementById(id);
  if (!target) {
    console.error(`scrollToId: Element with id "${id}" not found`);
    return;
  }

  // Use setTimeout to ensure menu animation doesn't interfere
  setTimeout(() => {
    const navBar = document.querySelector<HTMLElement>(NAV_BAR_SELECTOR);
    const headerOffset =
      (navBar?.getBoundingClientRect().height ?? 0) + EXTRA_OFFSET;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const scrollPosition = Math.max(0, targetPosition - headerOffset);

    window.scrollTo({ top: scrollPosition, behavior: "smooth" });
  }, 50);
}
