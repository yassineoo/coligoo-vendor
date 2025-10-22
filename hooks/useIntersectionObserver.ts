import { useEffect, useRef, useState, RefObject, useCallback } from "react";

export type IOOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
};

type Target =
  | RefObject<Element>
  | Element
  | Array<RefObject<Element> | Element>
  | null
  | undefined;

export function useIntersectionObserver(
  target: Target,
  callback?: (entry: IntersectionObserverEntry) => void,
  options: IOOptions = {}
) {
  const {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    freezeOnceVisible = false,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const isIntersecting = !!entry?.isIntersecting;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const optionsRef = useRef({ root, rootMargin, threshold, freezeOnceVisible });
  optionsRef.current = { root, rootMargin, threshold, freezeOnceVisible };

  const getElementsFromTarget = useCallback((t: Target): Element[] => {
    if (!t) return [];
    if (Array.isArray(t)) {
      return t
        .map((item) =>
          item && "current" in item
            ? (item.current as Element | null)
            : (item as Element | null)
        )
        .filter(Boolean) as Element[];
    }
    if ("current" in t) {
      return t.current ? [t.current as Element] : [];
    }
    return (t ? [t as Element] : []) as Element[];
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const opts = optionsRef.current;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          setEntry(e);
          if (callback) {
            try {
              callback(e);
            } catch (err) {
            }
          }
        });

        if (opts.freezeOnceVisible) {
          const anyVisible = entries.some((e) => e.isIntersecting);
          if (anyVisible && observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      },
      {
        root: opts.root ?? null,
        rootMargin: opts.rootMargin,
        threshold: opts.threshold,
      }
    );

    const elements = getElementsFromTarget(target);
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [target, callback]);

  return {
    entry,
    isIntersecting,
    observer: observerRef.current,
  } as const;
}

export function useOnScreen(
  ref: RefObject<Element> | null,
  opts: Omit<IOOptions, "freezeOnceVisible"> = {}
) {
  const { entry, isIntersecting } = useIntersectionObserver(
    ref,
    undefined,
    opts
  );
  return isIntersecting;
}
