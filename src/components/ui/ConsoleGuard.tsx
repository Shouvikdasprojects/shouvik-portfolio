'use client';

import { useEffect } from 'react';

export default function ConsoleGuard() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalWarn = console.warn;
    
    // Safely override console.warn to suppress Three.js third-party deprecations
    console.warn = (...args) => {
      if (
        args[0] &&
        typeof args[0] === 'string' &&
        (args[0].includes('THREE.Clock') || args[0].includes('THREE.Clock:'))
      ) {
        // Suppress the warning cleanly
        return;
      }
      originalWarn(...args);
    };

    return () => {
      console.warn = originalWarn; // Restore original logger on unmount
    };
  }, []);

  return null;
}
