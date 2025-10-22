import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = window.matchMedia(query);
    const handler = () => setMatches(m.matches);
    m.addEventListener ? m.addEventListener('change', handler) : m.addListener(handler);
    handler();
    return () => {
      m.removeEventListener ? m.removeEventListener('change', handler) : m.removeListener(handler);
    };
  }, [query]);

  return matches;
}
