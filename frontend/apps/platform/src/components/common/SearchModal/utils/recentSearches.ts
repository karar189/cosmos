/**
 * Recent Searches Utilities
 * Manages recent search items in localStorage
 */

export interface RecentSearchItem {
  id: string; // Changed from number to string to match API
  name: string;
  type: 'project' | 'exchange';
  chain?: string;
  logo?: string;
  pol: {
    score: number;
    grade: string;
  };
  timestamp: number;
}

const STORAGE_KEY = 'core3_recent_searches';
const MAX_RECENT_SEARCHES = 3;

/**
 * Check if we're running in the browser
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(): RecentSearchItem[] {
  if (!isBrowser()) {
    return [];
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading recent searches:', error);
    return [];
  }
}

/**
 * Add a new item to recent searches
 * Limits to MAX_RECENT_SEARCHES and removes duplicates
 */
export function addRecentSearch(item: Omit<RecentSearchItem, 'timestamp'>): void {
  if (!isBrowser()) {
    return;
  }
  
  try {
    const recent = getRecentSearches();
    
    // Remove duplicate if exists (same id and type)
    const filtered = recent.filter(
      (search) => !(search.id === item.id && search.type === item.type)
    );
    
    // Add new item at the beginning
    const updated = [
      { ...item, timestamp: Date.now() },
      ...filtered,
    ].slice(0, MAX_RECENT_SEARCHES); // Keep only MAX_RECENT_SEARCHES items
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent search:', error);
  }
}

/**
 * Clear all recent searches
 */
export function clearRecentSearches(): void {
  if (!isBrowser()) {
    return;
  }
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recent searches:', error);
  }
}

