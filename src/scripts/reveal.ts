/** Sections settle into place once as they arrive. Content is readable before this runs. */
export function startReveal() {
  const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -8% 0px" });
  els.forEach((e) => io.observe(e));
}
