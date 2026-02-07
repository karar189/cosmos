/**
 * Shared types for SearchModal components
 */

export type ProjectData = {
  id: string; // Changed from number to string to match API
  project: string; // Mapped from projectDetails.name
  chain: string; // Mapped from projectDetails.chains[0]?.name
  logo?: string;
  pol: { 
    score: number; 
    grade: string;
    confidence?: 'high' | 'medium' | 'low';
  };
  category?: string;
  ticker?: string;
  certification?: {
    level: string;
  };
  dataCoverage?: {
    percentage: number;
  };
};

export type ExchangeData = {
  id: string; // Changed from number to string
  name: string;
  logo?: string;
  rank?: number;
  security: { 
    score: number; 
    grade: string;
  };
  // Optional fields for future API data
  certification?: string;
  volume_24h?: string;
  volume_change?: {
    percentage: string;
    value: string;
  };
  liquidity?: string;
  security_features?: string[];
};

