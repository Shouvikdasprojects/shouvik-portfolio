'use client';

import { useEffect } from 'react';

export default function SpotlightCursor() {
  useEffect(() => {
    const el = document.createElement('div');
    el.className = 'cursor-spotlight';
    document.body.appendChild(el);

    let rafId: number;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.left = e.clientX + 'px';
        el.style.top = e.clientY + 'px';
      });
    };

    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(rafId);
      el.remove();
    };
  }, []);

  return null;
}
