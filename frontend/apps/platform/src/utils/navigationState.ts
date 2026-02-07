/**
 * Navigation State Management Utilities
 * 
 * Handles saving and restoring navigation state (filters, pagination, scroll position)
 * when navigating between ratings pages and detail pages.
 */

import { ProjectLayoutState } from '@/types/project-layout';

const STORAGE_KEY = 'core3_ratings_navigation_state';

/**
 * Save navigation state to localStorage
 * 
 * @param state - The navigation state to save
 */
export function saveNavigationState(state: ProjectLayoutState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save navigation state:', error);
  }
}

/**
 * Get saved navigation state from localStorage
 * 
 * @returns The saved navigation state, or null if none exists
 */
export function getNavigationState(): ProjectLayoutState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as ProjectLayoutState;
  } catch (error) {
    console.warn('Failed to get navigation state:', error);
    return null;
  }
}

/**
 * Clear navigation state from localStorage
 */
export function clearNavigationState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear navigation state:', error);
  }
}

