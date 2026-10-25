import { useState, useEffect } from "react";

/**
 * Custom hook to debounce rapidly changing values
 * @param {T} value - The value to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {T} Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Delay state update to prevent excessive operations during rapid changes
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
