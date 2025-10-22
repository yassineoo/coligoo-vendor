import { useRef, useState, useEffect } from 'react';

export function useThrottle<T>(value: T, limit = 200) {
  const lastRef = useRef<number>(0);
  const [throttled, setThrottled] = useState<T>(value);

  useEffect(() => {
    const now = Date.now();
    if (now - lastRef.current >= limit) {
      setThrottled(value);
      lastRef.current = now;
      return;
    }
    const timer = setTimeout(() => {
      setThrottled(value);
      lastRef.current = Date.now();
    }, limit - (now - lastRef.current));
    return () => clearTimeout(timer);
  }, [value, limit]);

  return throttled;
}

