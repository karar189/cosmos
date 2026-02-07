/**
 * Exchange API Response Types
 * These types represent the exact structure of data received from the server
 * Based on "Exchange Overview Schema v2"
 */

export interface ExchangeApiResponse {
  exchangeDetails: ExchangeDetails;
  securityScoreCategoriesDynamic?: SecurityScoreCategoriesDynamic;
  security?: SecuritySection;
  solvency?: SolvencySection;
  transparency?: TransparencySection;
  listedAssets?: ListedAssetsSection;
}

export interface ExchangeDetails {
  id: string;
  name: string;
  logo: string;
  rank: number;
  description: string;
  certification: {
    level: string;
  };
  users: number;
  dateOfOperation: string;
  jurisdiction: string;
  listedAssetsCount: number;
  documentation: string;
  socials: Array<{
    url: string;
    logo: string;
  }>;
  audits: Array<{
    auditor: {
      name: string;
      logo: string;
    };
    report: {
      url: string;
    };
  }>;
  disclosures?: {
    policies?: {
      url: string;
    };
    attestations?: {
      url: string;
    };
    legal?: {
      url: string;
    };
  };
  security: {
    score: {
      current: number;
      min: number;
      max: number;
    };
    grade: {
      label: string;
      tier: 'high' | 'medium' | 'low';
    };
    confidence: 'high' | 'medium' | 'low' | null;
    change24h: number | null;
    dataCoverage: {
      percentage: number | null;
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
  };
  newsFeed: {
    topRisks: Array<{
      date: string;
      content: string;
    }>;
    recentChanges: Array<{
      date: string;
      content: string;
    }>;
  };
}

export interface SecurityScoreCategoriesDynamic {
  window: string;
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

export interface SecuritySection {
  score: {
    current: number;
    max: number;
    label: string;
  };
  server: {
    sslTlsCertificate: {
      score: number;
      maxScore: number;
    };
    wasCdn: {
      score: number;
      maxScore: number;
    };
    spamDbPresence: string;
    cookieFlags: string[];
    certificationTags: Array<{
      label: string;
      tooltip: string;
      value?: string;
    }>;
  };
  user: {
    isTwoFactorAuthenticationPresent: boolean;
    isAntiPhishingProtectionPresent: boolean;
    isWithdrawalWhitelistingPresent: boolean;
    isCaptchaProtectionPresent: boolean;
    deviceManagement: string;
    passwordRequirements: string[];
  };
  penetrationTest: {
    coverage: {
      percentage: number;
    };
    score?: {
      current: number;
      maxScore: number;
    };
  };
  isInsuranceFundPresent: boolean;
  bugBounty: {
    status: {
      label: string;
    };
    payoutRange: string;
    provider: {
      url: string;
      name: string;
      logo: string;
    };
    score?: {
      current: number;
      maxScore: number;
    };
  };
  serverSecurity?: {
    score: number;
    maxScore: number;
  };
  userSecurity?: {
    score: number;
    maxScore: number;
  };
}

export interface SolvencySection {
  score: {
    current: number;
    max: number;
    label: string;
  };
  proofOfReserves: {
    isProofOfReservesAuditPresent: boolean;
    isProofOfOwnerPresent: boolean;
    userScope: string;
    assetComposition: string;
    regulatory: string;
    merkleTree: string;
  };
  auditUsersCoverage: {
    percentage: number;
  };
  rehypothecationPolicy: {
    label: string;
    severity: string;
  };
  liabilityVsReserves: {
    window: string;
    points: Array<{
      date: string;
      percentage: number;
    }>;
  };
}

export interface TransparencySection {
  score: {
    current: number;
    max: number;
    label: string;
  };
  isWalletTrackingPresent: boolean;
  lastLiabilitiesSnapshot: {
    date: string;
    totalUsd: number;
  };
  reserves: {
    totalUsd: number;
    totalWallets: number;
    assetsList: {
      list: Array<{
        ticker: string;
        logo: string;
        address: string;
        amount: number;
        valueUsd: number;
      }>;
    };
    assetsDistribution: Array<{
      ticker: string;
      percentage: number;
    }>;
  };
}

export interface ListedAssetsSection {
  total: number;
  list: Array<{
    ticker: string;
    name: string;
    logo: string | null;
    address: string | null;
    marketCap: number | null;
    tokenAudits: string;
    category: string | null;
    projectId?: string | null;
    balance?: string | null;
    bugBounty?: string | boolean | null;
    pol: {
      score: number;
      grade: string;
      severity: string;
    } | null;
  }>;
}
