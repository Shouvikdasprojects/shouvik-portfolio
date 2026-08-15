'use client';

const BOOKMARK_STORAGE_KEY = 'shouvik_portfolio_saved_articles';

export function getSavedArticleSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isArticleSaved(slug: string): boolean {
  const saved = getSavedArticleSlugs();
  return saved.includes(slug);
}

export function toggleArticleSaved(slug: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const saved = getSavedArticleSlugs();
    let updated: string[];
    let nowSaved: boolean;
    
    if (saved.includes(slug)) {
      updated = saved.filter(s => s !== slug);
      nowSaved = false;
    } else {
      updated = [slug, ...saved];
      nowSaved = true;
    }
    
    localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('bookmarks-updated', { detail: { slug, saved: nowSaved, all: updated } }));
    return nowSaved;
  } catch {
    return false;
  }
}
