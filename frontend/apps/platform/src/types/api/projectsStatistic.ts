/**
 * Projects Statistic API response.
 */
export interface ProjectsStatisticApiResponse {
  /** List of top PoL gainers */
  topPolGainers: TopPolProjectItem[];
  /** List of top PoL losers */
  topPolLosers: TopPolProjectItem[];
  /** List of most common issues */
  mostCommonIssues: CommonIssueItem[];
  /** Probability of Loss dynamic data */
  probabilityOfLossDynamic: ProbabilityOfLossDynamic;
  /** List of projects */
  projectsList: ProjectsList;
}

/**
 * An item in the Top PoL gainers/losers list.
 */
export interface TopPolProjectItem {
  /** Project information */
  project: {
    /** Project ID */
    id: string;
    /** Project name */
    name: string;
    /** Project logo URL */
    logo: string;
  };
  /** Probability of Loss data */
  probabilityOfLoss: {
    /** PoL score */
    score: number;
    /** PoL grade */
    grade: string;
    /** Change in PoL score */
    delta: number;
  };
}

/**
 * Common Issue item.
 */
export interface CommonIssueItem {
  /** Issue name/description */
  name: string;
  /** Number of projects affected */
  projectsCount: number;
}

/**
 * Probability of Loss dynamic time series.
 */
export interface ProbabilityOfLossDynamic {
  /** Time window, e.g. "30d" */
  window: string;
  /** Data points for the dynamic */
  points: Array<{
    /** Date (ISO string) */
    date: string;
    /** Average PoL score */
    averagePolScore: number;
  }>;
}

/**
 * Project list wrapper.
 */
export interface ProjectsList {
  /** List of projects */
  list: ProjectListItem[];
}

/**
 * Item in the projects list.
 */
export interface ProjectListItem {
  /** Project rank */
  rank: number;
  /** Project information */
  project: {
    /** Project ID */
    id: string;
    /** Project name */
    name: string;
    /** Project ticker symbol */
    ticker: string;
    /** Project logo URL */
    logo: string;
    /** Project category */
    category: string;
  };
  chains: {name: string}[];
  compliance: string[];
  /** Certification information */
  certification: {
    /** Certification level */
    level: string;
  };
  /** Probability of Loss stats */
  pol: {
    /** PoL score */
    score: number;
    /** PoL grade */
    grade: string;
  };
  /** Data coverage */
  dataCoverage: {
    /** Coverage percentage */
    percentage: number;
  };
  /** Market data */
  marketData: {
    market_cap: number|null;
    market_cap_change_24h: number|null;
    market_cap_change_percentage_24h: number|null;
  };
}
