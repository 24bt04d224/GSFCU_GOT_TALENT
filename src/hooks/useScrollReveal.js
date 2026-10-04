import { useEffect } from 'react';

export function useScrollReveal(dependencyArray = []) {
  useEffect(() => {
    // Respect prefers-reduced-motion for accessibility
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Instantly reveal all elements if user prefers reduced motion
      document.querySelectorAll('.reveal-on-scroll, [data-reveal]').forEach((el) => {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    // Give DOM a tick to complete rendering
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal-on-scroll, [data-reveal]');
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, dependencyArray);
}
