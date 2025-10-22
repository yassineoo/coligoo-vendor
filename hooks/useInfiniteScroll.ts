import { useEffect, useRef } from 'react';

type Options = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

export function useInfiniteScroll(
  sentinelRef: React.RefObject<Element>,
  onVisible: () => void,
  opts: Options = {}
) {
  const calledRef = useRef(false);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            if (calledRef.current) return;
            calledRef.current = true;
            try { onVisible(); } finally {
              setTimeout(() => { calledRef.current = false; }, 200);
            }
          }
        });
      },
      { root: opts.root ?? null, rootMargin: opts.rootMargin ?? '0px', threshold: opts.threshold ?? 0.1 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [sentinelRef, onVisible, opts.root, opts.rootMargin, opts.threshold]);
}
