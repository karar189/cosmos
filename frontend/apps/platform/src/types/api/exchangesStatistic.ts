/**
 * Exchanges Statistic API response.
 * Based on exchange-ratings_schema.json
 */
export interface ExchangesStatisticApiResponse {
  /** List of top security ratings */
  topSecurityRations: TopSecurityExchangeItem[];
  /** List of top solvency ratings */
  topSolvencyRating: TopSolvencyExchangeItem[];
  /** Transparency statistics */
  transparency: TransparencyStats;
  /** Lost funds data */
  lostFunds: LostFundsData;
  /** List of exchanges */
  exchangesList: ExchangesList;
}

/**
 * An item in the Top Security ratings list.
 */
export interface TopSecurityExchangeItem {
  /** Exchange information */
  exchange: {
    /** Exchange ID */
    id: string;
    /** Exchange name */
    name: string;
    /** Exchange logo URL */
    logo: string | null;
  };
  /** Security data */
  security: {
    /** Security score */
    score: number;
    /** Security grade */
    grade: string;
  };
}

/**
 * An item in the Top Solvency ratings list.
 */
export interface TopSolvencyExchangeItem {
  /** Exchange information */
  exchange: {
    /** Exchange ID */
    id: string;
    /** Exchange name */
    name: string;
    /** Exchange logo URL */
    logo: string | null;
  };
  /** Solvency data */
  solvency: {
    /** Solvency score */
    score: number;
    /** Severity level */
    severity: string;
  };
}

/**
 * Transparency statistics.
 */
export interface TransparencyStats {
  /** Transparent exchanges percentage */
  transparent: {
    percentage: number;
  };
  /** Not transparent exchanges percentage */
  notTransparent: {
    percentage: number;
  };
}

/**
 * Lost funds data.
 */
export interface LostFundsData {
  /** Total lost funds in USD over 1 year */
  totalUsd1y: number | null;
  /** Change in lost funds over 1 year */
  deltaUsd1y: number | null;
}

/**
 * Exchange list wrapper.
 */
export interface ExchangesList {
  /** List of exchanges */
  list: ExchangeListItem[];
}

/**
 * Item in the exchanges list.
 */
export interface ExchangeListItem {
  /** Exchange rank */
  rank: number;
  /** Exchange information */
  exchange: {
    /** Exchange ID */
    id: string;
    /** Exchange name */
    name: string;
    /** Exchange logo URL */
    logo: string;
  };
  /** Certification information */
  certification: {
    /** Certification level */
    level: string;
  };
  /** Security stats */
  security: {
    /** Security score */
    score: number;
    /** Security grade */
    grade: string;
    /** Severity level */
    severity: string | null;
  };
  /** Bug bounty program status */
  bugBounty?: {
    /** Whether the exchange has an active bug bounty program */
    isActive: boolean;
  };
  /** Proof of reserves status */
  proofOfReserves?: {
    /** Whether the exchange has proof of reserves */
    isPresent: boolean;
  };
  /** Penetration testing status */
  penetrationTest?: {
    /** Whether the exchange has penetration testing */
    isPresent: boolean;
  };
  /** Listed assets/tokens on this exchange */
  listedAssets?: string[];
  /** Trade volume details */
  tradeVolume?: {
    trade_volume_24h: number|null;
    trade_volume_change_24h: number|null;
    trade_volume_change_percentage_24h: number|null;
  };
}


