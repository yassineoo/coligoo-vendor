import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return typeof initialValue === 'function' ? (initialValue as any)() : initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : (typeof initialValue === 'function' ? (initialValue as any)() : initialValue);
    } catch {
      return typeof initialValue === 'function' ? (initialValue as any)() : initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState] as const;
}
