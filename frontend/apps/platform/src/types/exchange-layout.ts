/**
 * Types for Project Layout components
 */

export interface ExchangeHeaderData {
    id: string;
    name: string;
    icon: string;
    rank: number;
    certification: string; // gold, silver, bronze
  }
  
  export interface ExchangeLayoutState {
    page?: number;
    filters?: Record<string, unknown>;
    tab?: string;
    scrollPosition?: number;
  }
  
  