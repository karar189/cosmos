/**
 * Types for Project Layout components
 */

export interface ProjectHeaderData {
  id: string;
  name: string;
  ticker: string;
  icon: string;
  /** @deprecated COSMOS uses launchStage instead */
  rank: number;
  /** @deprecated COSMOS uses regulatoryTier instead */
  certification: string;
  /** Operational: Draft | In Progress | Live */
  launchStage?: string;
  /** Informational tier, not a score */
  regulatoryTier?: string;
}

export interface ProjectLayoutState {
  page?: number;
  filters?: Record<string, unknown>;
  tab?: string;
  scrollPosition?: number;
}

