import type { UserRegistryWalletsConfig, UserRegistryRow, ReliabilityScoreData } from './UserRegistryWidget.types';

/** Parse parameters JSON; return default if invalid. */
export function parseUserRegistryParameters(parameters: string | null): UserRegistryWalletsConfig {
  if (!parameters?.trim()) {
    return { network: 'stellar', wallets: [] };
  }
  try {
    const parsed = JSON.parse(parameters) as unknown;
    if (parsed && typeof parsed === 'object' && Array.isArray((parsed as UserRegistryWalletsConfig).wallets)) {
      const config = parsed as UserRegistryWalletsConfig;
      return {
        network: typeof config.network === 'string' ? config.network : 'stellar',
        wallets: config.wallets.filter((w) => w && typeof w.address === 'string'),
      };
    }
  } catch {
    // fall through to default
  }
  return { network: 'stellar', wallets: [] };
}

/** Shorten Stellar address for display (first 4 + ... + last 4). */
export function shortAddress(address: string): string {
  const a = String(address).trim();
  if (a.length <= 12) return a;
  return `${a.slice(0, 4)}…${a.slice(-4)}`;
}

/** Generate mock row data for each wallet (transaction volume, change 24h, asset count). */
export function buildMockRows(config: UserRegistryWalletsConfig): UserRegistryRow[] {
  return config.wallets.map((w, i) => {
    const seed = (w.address.slice(0, 8) + i).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const volume = 50_000 + (seed % 950_000);
    const changePct = (seed % 21) - 10;
    const assets = 1 + (seed % 12);
    return {
      rank: i + 1,
      address: w.address,
      shortAddress: shortAddress(w.address),
      transactionVolume: volume,
      transactionVolumeChange24h: changePct,
      assetCount: assets,
    };
  });
}

/** Build mock ScoreData for reliability popup (Probability of Loss style). */
export function buildMockReliabilityScore(address: string): ReliabilityScoreData {
  const seed = address.slice(0, 12).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const score = 20 + (seed % 60);
  const grades = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C'] as const;
  const gradeIndex = Math.min(Math.floor(score / 12), grades.length - 1);
  const tier: 'high' | 'medium' | 'low' = score > 50 ? 'high' : score > 30 ? 'medium' : 'low';
  const categories = [
    { name: 'Security', score: 15 + (seed % 70) },
    { name: 'Financial', score: 40 + (seed % 50) },
    { name: 'Operational', score: 20 + (seed % 60) },
    { name: 'Reputational', score: 50 + (seed % 40) },
    { name: 'Regulatory', score: 10 + (seed % 50) },
  ];
  const points: Array<{ date: string; averagePolScore: number }> = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    points.push({
      date: d.toISOString().split('T')[0],
      averagePolScore: Math.max(0, Math.min(100, score - 5 + (seed % 15) + (13 - i) * 0.5)),
    });
  }
  return {
    score: { current: score, min: 0, max: 100 },
    grade: { label: grades[gradeIndex], tier },
    confidence: 'high',
    change24h: (seed % 5) - 2,
    dataCoverage: { percentage: 85 },
    categories: categories.map((c) => ({
      name: c.name,
      score: { current: c.score, min: 0, max: 100 },
    })),
    dynamic: {
      window: '14d',
      score: { min: 0, max: 100 },
      points,
    },
  };
}
