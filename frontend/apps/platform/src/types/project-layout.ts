/**
 * Types for Project Layout components
 */

export interface ProjectHeaderData {
  id: string;
  name: string;
  ticker: string;
  icon: string;
  rank: number;
  certification: string; // gold, silver, bronze
}

export interface ProjectLayoutState {
  page?: number;
  filters?: Record<string, unknown>;
  tab?: string;
  scrollPosition?: number;
}

