/**
 * API Response Types
 * These types represent the exact structure of data received from the server
 * Based on "Project Overview Schema v2"
 */

export interface ProjectApiResponse {
  projectDetails: ProjectDetails;
  probabilityOfLoss: ProbabilityOfLoss;
  newsFeed: NewsFeed;
  probabilityOfLossCategoriesDynamic?: ProbabilityOfLossCategoriesDynamic;
  security?: Security;
  financial?: Financial;
  operational?: Operational;
  reputational?: Reputational;
  regulatory?: Regulatory;
  dependency?: Dependency;
  proofOfOpinion?: ProofOfOpinion;
}

export interface ProjectDetails {
  id: string;
  name: string;
  ticker: string;
  coingeckoId?: string | null;
  logo: string;
  rank?: number;
  description: string;
  certification: {
    level: string;
  };
  chains: Array<{
    name: string;
    logo: string | null;
  }>;
  category: string;
  tags: string[];
  launchedAt: string;
  website: {
    url: string;
  };
  socials: Array<{
    url: string;
    logo: string | null;
  }>;
  hasToken: boolean;
  projectBucket?: string;
  ucid?: number;
  disclosures: {
    whitepaper?: {
      url: string;
    };
    legal?: {
      url: string;
    };
    audits?: Array<{
      auditor: {
        name: string;
        logo: string | null;
      };
      report: {
        url: string;
      };
    }>;
  };
}

export interface ProbabilityOfLoss {
  score: {
    current: number;
    min: number;
    max: number;
  };
  grade: {
    label: string;
    tier: 'high' | 'medium' | 'low';
  };
  confidence: 'high' | 'medium' | 'low';
  change24h: number;
  dataCoverage: {
    percentage: number;
  };
  categories: Array<{
    name: string;
    score: {
      current: number;
      min: number;
      max: number;
    };
  }>;
  dynamic?: {
    window: string;
    score: {
      min: number;
      max: number;
    };
    points: Array<{
      date: string;
      averagePolScore: number;
    }>;
  };
}

export interface NewsFeed {
  topRisks: Array<{
    date: string;
    content: string;
  }>;
  recentChanges: Array<{
    date: string;
    content: string;
  }>;
}

export interface ProbabilityOfLossCategoriesDynamic {
  score: {
    min: number;
    max: number;
  };
  points: Array<{
    date: string;
    categories: Array<{
      name: string;
      score: number;
    }>;
  }>;
}

export interface Security {
  score: {
    current: number;
    min?: number;
    max: number;
    label?: string;
  };
  audits?: {
    token: Array<AuditItem>;
    product: Array<AuditItem>;
  };
  bugBounty?: {
    custody: string;
    payoutPolicy: string;
    isAttestationSlaPresent: boolean;
    provider: {
      url: string;
      name: string;
      logo: string | null;
    };
  };
  tokenContracts?: {
    isVerifiedOnChain: boolean;
    isAudited: boolean;
  };
  controls?: {
    isCircuitBreakerPresent: boolean;
    isOnChainMonitoringPresent: boolean;
  };
  certifications?: {
    iso: boolean;
    ccss: boolean;
  };
  thirdPartyMonitoring?: {
    label: string;
    severity: string;
  };
}

export interface AuditItem {
  report: {
    url: string;
  };
  auditor: {
    name: string;
    logo: string | null;
  };
  date: string;
  fixedFindings?: {
    label: string;
    severity: string;
  };
  isAuditCodeAccessPresent?: boolean;
  isChanged?: boolean;
}

export interface Financial {
  score: {
    current: number;
    min?: number;
    max: number;
    label?: string;
  };
  activeAddresses?: {
    window: string;
    points: Array<{
      date: string;
      count: number;
    }>;
  };
  inflation?: {
    window: string;
    points: Array<{
      date: string;
      percentage: number;
    }>;
  };
  totalValueLocked?: {
    window: string;
    lastUpdatedAt: string;
    tags: Array<{
      label: string;
      severity: string;
    }>;
    points: Array<{
      date: string;
      percentage: number;
    }>;
  };
  revenueSources?: Array<{
    label: string;
    percentage?: number;
  }>;
  treasuryQuality?: {
    topTierAssetsShare: string | null;
    trend: {
      label: string | null;
      severity: string;
    };
    isSpikesPresent: boolean;
    assetDistribution: Array<{
      label: string;
      percentage?: number;
    }>;
  };
  circularSupplyAnalysis?: {
    matchesDeclared: string;
    isLessThanTotalSupply: boolean;
    deviation: string | null;
  };
  lockersAnalysis?: {
    type: string;
  };
}

export interface Operational {
  score: {
    current: number;
    min?: number;
    max: number;
    label?: string;
  };
  githubActivity?: {
    commitsCount7d?: number;
    heatmap?: {
      intensities?: number[];
      points?: Array<{
        date: string;
        intensity: number;
      }>;
    };
  };
  teamTrackRecords?: {
    isEducationRelevant: boolean;
    isWorkExperienceRelevant: boolean;
    isBusinessExperienceRelevant: boolean;
  };
  liquidityRisks?: {
    dexLpToMcap: string;
    cexVolToMcap: string;
    orderbookToMcap: string;
    cexQuality: string;
    dexLpState: string;
  };
  documentation?: Array<{
    label: string;
    url: string;
  }>;
  washtrading?: {
    cexHoldingsVsVolume: {
      label: string;
      severity: string;
    };
    dynamic: {
      window: string;
      points: Array<{
        date: string;
        cexHoldingsCount: number;
        volumeUsd: number;
      }>;
    };
  };
  certifications?: {
    iso: boolean;
    ccss: boolean;
  };
}

export interface Reputational {
  score: {
    current: number;
    min?: number;
    max: number;
    label?: string;
  };
  insurance?: {
    custody: string;
    coverage: string;
  };
  auditReputation?: {
    topAuditor: {
      name: string;
      logo: string | null;
      grade: {
        label: string;
        tier: string;
      };
    };
  };
  pastIncidentsReaction?: {
    mediaReactions: string;
    isRootCauseFixed: boolean;
  };
  redFlags?: {
    mmRedFlags: string;
    investorRedFlags: string;
  };
  longevity?: {
    projectLaunchedAt: string;
    protocolLaunchedAt: string;
  };
  social?: {
    twitter?: {
      score: string;
      label: string;
    };
    website?: {
      visits: {
        count: number;
        tag: {
          label: string;
          severity: string;
        };
      };
    };
    googleTrends?: {
      tag: {
        label: string;
        severity: string;
      };
    };
    interactions?: {
      count?: number;
      tag: {
        label: string;
        severity: string;
      };
    };
    bots?: {
      ratio: string;
      tag: {
        label: string;
        severity: string;
      };
    };
  };
}

export interface Regulatory {
  score: {
    current: number;
    min?: number;
    max: number;
    label?: string;
  };
  regulatorySurfaceControls?: {
    isKycPresented?: boolean;
    isKytPresented?: boolean;
  };
  jurisdictionQuality?: string;
  isLegalPresent?: boolean;
  isPublicRegistrationPresent?: boolean;
  isTeamTransparencyPublic?: boolean;
  operatesUnderRegulations?: boolean;
}

export interface Dependency {
  score: {
    current: number;
    min?: number;
    max: number;
    label?: string;
  };
}

export interface ProofOfOpinion {
  communitySentiment?: {
    percentage: {
      min: number;
      max: number;
    };
    points: Array<{
      date: string;
      positive: number;
      negative: number;
    }>;
  };
  prosAndCons?: {
    pros: string[];
    cons: string[];
  };
  expertReviews?: {
    total: number;
    reviews: Array<{
      reviewer: {
        tag: string;
      };
      date: string;
      text: string;
      url: string | null;
    }>;
  };
}
