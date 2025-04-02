
import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive media queries
 * @param query - The media query to watch, e.g. "(min-width: 768px)"
 * @returns - Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // Default to true for server-side rendering
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    const updateMatch = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Add listener
    mediaQuery.addEventListener('change', updateMatch);
    
    // Clean up
    return () => mediaQuery.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
}
