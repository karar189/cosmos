/**
 * JSON format submitted during User Registry widget creation.
 */
export interface UserRegistryWalletsConfig {
  network: string;
  wallets: Array<{ address: string }>;
}

export interface UserRegistryRow {
  rank: number;
  address: string;
  shortAddress: string;
  transactionVolume: number;
  transactionVolumeChange24h: number;
  assetCount: number;
}

/** Mock risk/ScoreData for the reliability popup (Probability of Loss style). */
export interface ReliabilityScoreData {
  score: { current: number; min: number; max: number };
  grade: { label: string; tier: 'high' | 'medium' | 'low' };
  confidence: 'high' | 'medium' | 'low' | null;
  change24h: number | null;
  dataCoverage: { percentage: number | null };
  categories: Array<{
    name: string;
    score: { current: number; min: number; max: number };
  }>;
  dynamic?: {
    window: string;
    score: { min: number; max: number };
    points: Array<{ date: string; averagePolScore: number }>;
  };
}
