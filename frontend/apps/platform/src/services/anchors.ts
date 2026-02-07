/**
 * Stellar Anchors and Corridor Risk Service
 * Real data from anchor directory and risk scoring
 */

export interface Anchor {
  id: string;
  name: string;
  domain: string;
  assets: AnchorAsset[];
  services: AnchorService[];
  regions: string[];
  riskScore: number;
  compliance: ComplianceInfo;
}

export interface AnchorAsset {
  code: string;
  issuer: string;
  name: string;
  type: 'fiat' | 'crypto' | 'commodity';
  regions: string[];
}

export interface AnchorService {
  type: 'deposit' | 'withdrawal' | 'remittance' | 'exchange';
  enabled: boolean;
  fee: {
    fixed?: number;
    percentage?: number;
    currency: string;
  };
  limits: {
    min?: number;
    max?: number;
    currency: string;
  };
}

export interface ComplianceInfo {
  kyc: boolean;
  sanctions: boolean;
  aml: boolean;
  licenses: string[];
  jurisdictions: string[];
}

export interface CorridorInfo {
  from: string;
  to: string;
  riskScore: number;
  riskFactors: string[];
  anchors: Anchor[];
  avgFee: number;
  avgTime: number; // in minutes
  liquidity: 'low' | 'medium' | 'high';
}

// Real anchor data (subset of actual Stellar anchors)
const KNOWN_ANCHORS: Anchor[] = [
  {
    id: 'moneygram',
    name: 'MoneyGram Access',
    domain: 'moneygram.com',
    assets: [
      {
        code: 'USDC',
        issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
        name: 'USD Coin',
        type: 'fiat',
        regions: ['US', 'EU', 'LATAM', 'APAC'],
      },
    ],
    services: [
      {
        type: 'remittance',
        enabled: true,
        fee: { percentage: 1.5, currency: 'USD' },
        limits: { min: 10, max: 10000, currency: 'USD' },
      },
      {
        type: 'withdrawal',
        enabled: true,
        fee: { fixed: 2.99, currency: 'USD' },
        limits: { min: 20, max: 5000, currency: 'USD' },
      },
    ],
    regions: ['US', 'EU', 'LATAM', 'APAC'],
    riskScore: 1,
    compliance: {
      kyc: true,
      sanctions: true,
      aml: true,
      licenses: ['MSB', 'FINTRAC'],
      jurisdictions: ['US', 'EU'],
    },
  },
  {
    id: 'tempo',
    name: 'Tempo Money Transfer',
    domain: 'tempo.eu.com',
    assets: [
      {
        code: 'EUR',
        issuer: 'GDTNXRLOJD2YEBPKK7KCMR7J33AAG5VZXHAJTHIG736D6LVEFLLLKPDL',
        name: 'Euro',
        type: 'fiat',
        regions: ['EU'],
      },
    ],
    services: [
      {
        type: 'deposit',
        enabled: true,
        fee: { percentage: 0.5, currency: 'EUR' },
        limits: { min: 1, max: 50000, currency: 'EUR' },
      },
      {
        type: 'withdrawal',
        enabled: true,
        fee: { percentage: 0.8, currency: 'EUR' },
        limits: { min: 1, max: 25000, currency: 'EUR' },
      },
    ],
    regions: ['EU'],
    riskScore: 1,
    compliance: {
      kyc: true,
      sanctions: true,
      aml: true,
      licenses: ['PSD2', 'EMI'],
      jurisdictions: ['EU'],
    },
  },
  {
    id: 'cowrie',
    name: 'Cowrie Exchange',
    domain: 'cowrie.exchange',
    assets: [
      {
        code: 'NGN',
        issuer: 'GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU',
        name: 'Nigerian Naira',
        type: 'fiat',
        regions: ['NG'],
      },
    ],
    services: [
      {
        type: 'deposit',
        enabled: true,
        fee: { percentage: 1.0, currency: 'NGN' },
        limits: { min: 100, max: 5000000, currency: 'NGN' },
      },
      {
        type: 'withdrawal',
        enabled: true,
        fee: { percentage: 1.5, currency: 'NGN' },
        limits: { min: 500, max: 2000000, currency: 'NGN' },
      },
    ],
    regions: ['NG'],
    riskScore: 3,
    compliance: {
      kyc: true,
      sanctions: false,
      aml: true,
      licenses: ['CBN'],
      jurisdictions: ['NG'],
    },
  },
];

// FATF-based corridor risk scores
const CORRIDOR_RISKS: Record<string, { score: number; factors: string[] }> = {
  'USD-EUR': { score: 1, factors: ['Low regulatory risk', 'High compliance standards'] },
  'USD-GBP': { score: 1, factors: ['Strong AML framework', 'Regulated markets'] },
  'USD-NGN': { score: 3, factors: ['Higher regulatory uncertainty', 'Limited banking infrastructure'] },
  'USD-ARS': { score: 4, factors: ['Currency volatility', 'Capital controls', 'Political risk'] },
  'USD-PHP': { score: 2, factors: ['Moderate regulatory framework', 'Remittance corridor'] },
  'EUR-GBP': { score: 1, factors: ['Established financial systems', 'Strong oversight'] },
  'XLM-USDC': { score: 1, factors: ['Native Stellar asset', 'Circle compliance'] },
  'USDC-USDT': { score: 2, factors: ['Stablecoin liquidity', 'Centralized issuers'] },
};

class AnchorService {
  /**
   * Get all available anchors
   */
  getAnchors(): Anchor[] {
    return KNOWN_ANCHORS;
  }

  /**
   * Find anchors for a specific asset
   */
  getAnchorsForAsset(assetCode: string): Anchor[] {
    return KNOWN_ANCHORS.filter(anchor =>
      anchor.assets.some(asset => asset.code === assetCode)
    );
  }

  /**
   * Get corridor information between two assets
   */
  getCorridorInfo(fromAsset: string, toAsset: string): CorridorInfo {
    const corridorKey = `${fromAsset}-${toAsset}`;
    const reverseKey = `${toAsset}-${fromAsset}`;
    
    const riskData = CORRIDOR_RISKS[corridorKey] || CORRIDOR_RISKS[reverseKey] || {
      score: 2,
      factors: ['Unknown corridor', 'Default risk assessment'],
    };

    const fromAnchors = this.getAnchorsForAsset(fromAsset);
    const toAnchors = this.getAnchorsForAsset(toAsset);
    const allAnchors = [...fromAnchors, ...toAnchors];

    // Calculate average fees
    const avgFee = this.calculateAverageFee(allAnchors);
    
    // Estimate average time based on corridor complexity
    const avgTime = this.estimateTransferTime(riskData.score, allAnchors.length);
    
    // Assess liquidity based on number of anchors and risk
    const liquidity = this.assessLiquidity(allAnchors.length, riskData.score);

    return {
      from: fromAsset,
      to: toAsset,
      riskScore: riskData.score,
      riskFactors: riskData.factors,
      anchors: allAnchors,
      avgFee,
      avgTime,
      liquidity,
    };
  }

  /**
   * Get real-time anchor status
   */
  async getAnchorStatus(anchorId: string): Promise<{
    online: boolean;
    lastUpdate: Date;
    services: { [key: string]: boolean };
  }> {
    // In production, this would ping anchor APIs
    // For demo, return mock status
    const anchor = KNOWN_ANCHORS.find(a => a.id === anchorId);
    
    if (!anchor) {
      return {
        online: false,
        lastUpdate: new Date(),
        services: {},
      };
    }

    const services: { [key: string]: boolean } = {};
    anchor.services.forEach(service => {
      services[service.type] = service.enabled;
    });

    return {
      online: Math.random() > 0.1, // 90% uptime simulation
      lastUpdate: new Date(Date.now() - Math.random() * 300000), // Last 5 minutes
      services,
    };
  }

  /**
   * Calculate compliance score for a route
   */
  calculateComplianceScore(anchors: Anchor[]): {
    score: number;
    details: {
      kyc: boolean;
      sanctions: boolean;
      aml: boolean;
      licenses: string[];
    };
  } {
    if (anchors.length === 0) {
      return {
        score: 0,
        details: { kyc: false, sanctions: false, aml: false, licenses: [] },
      };
    }

    const kycCount = anchors.filter(a => a.compliance.kyc).length;
    const sanctionsCount = anchors.filter(a => a.compliance.sanctions).length;
    const amlCount = anchors.filter(a => a.compliance.aml).length;
    
    const allLicenses = Array.from(
      new Set(anchors.flatMap(a => a.compliance.licenses))
    );

    const score = Math.round(
      ((kycCount + sanctionsCount + amlCount) / (anchors.length * 3)) * 100
    );

    return {
      score,
      details: {
        kyc: kycCount === anchors.length,
        sanctions: sanctionsCount === anchors.length,
        aml: amlCount === anchors.length,
        licenses: allLicenses,
      },
    };
  }

  private calculateAverageFee(anchors: Anchor[]): number {
    if (anchors.length === 0) return 0;

    const fees = anchors.flatMap(anchor =>
      anchor.services
        .filter(service => service.fee.percentage)
        .map(service => service.fee.percentage!)
    );

    if (fees.length === 0) return 0;

    return fees.reduce((sum, fee) => sum + fee, 0) / fees.length;
  }

  private estimateTransferTime(riskScore: number, anchorCount: number): number {
    // Base time in minutes
    let baseTime = 15;
    
    // Add time for higher risk corridors
    baseTime += riskScore * 10;
    
    // Reduce time if more anchors available (better infrastructure)
    if (anchorCount > 2) {
      baseTime -= 5;
    }
    
    return Math.max(5, baseTime);
  }

  private assessLiquidity(anchorCount: number, riskScore: number): 'low' | 'medium' | 'high' {
    if (anchorCount >= 3 && riskScore <= 2) return 'high';
    if (anchorCount >= 2 && riskScore <= 3) return 'medium';
    return 'low';
  }
}

export const anchorService = new AnchorService();