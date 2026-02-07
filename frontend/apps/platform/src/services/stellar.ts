/**
 * Stellar API Service
 * Real-time routing engine using Horizon APIs
 */

import { anchorService } from './anchors';

export interface StellarAsset {
  asset_type: 'native' | 'credit_alphanum4' | 'credit_alphanum12';
  asset_code?: string;
  asset_issuer?: string;
}

export interface PathPaymentRoute {
  source_asset_type: string;
  source_asset_code?: string;
  source_asset_issuer?: string;
  source_amount: string;
  destination_asset_type: string;
  destination_asset_code?: string;
  destination_asset_issuer?: string;
  destination_amount: string;
  path: StellarAsset[];
}

export interface OrderbookEntry {
  price: string;
  amount: string;
}

export interface OrderbookData {
  bids: OrderbookEntry[];
  asks: OrderbookEntry[];
  base: StellarAsset;
  counter: StellarAsset;
}

export interface RouteScore {
  cost: number;
  time: number;
  risk: number;
  liquidity: number;
  overall: number;
}

export interface EnhancedRoute extends PathPaymentRoute {
  id: string;
  name: string;
  hops: number;
  score: RouteScore;
  slippage: number;
  compliance: boolean;
  corridorRisk: number;
}

// Known asset configurations
export const KNOWN_ASSETS = {
  USDC_CIRCLE: {
    asset_type: 'credit_alphanum4' as const,
    asset_code: 'USDC',
    asset_issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
  },
  USDT_TETHER: {
    asset_type: 'credit_alphanum4' as const,
    asset_code: 'USDT',
    asset_issuer: 'GCQTGZQQ5G4PTM2GL7CDIFKUBIPEC52BROAQIAPW53XBRJVN6ZJVTG6V',
  },
  XLM_NATIVE: {
    asset_type: 'native' as const,
  },
  EUR_TEMPO: {
    asset_type: 'credit_alphanum4' as const,
    asset_code: 'EUR',
    asset_issuer: 'GDTNXRLOJD2YEBPKK7KCMR7J33AAG5VZXHAJTHIG736D6LVEFLLLKPDL',
  },
};

// Corridor risk scores (can be enhanced with real FATF data)
const CORRIDOR_RISK_SCORES: Record<string, number> = {
  'USD-EUR': 1, // Low risk
  'USD-GBP': 1,
  'USD-ARS': 3, // High risk
  'USD-NGN': 3,
  'USD-PHP': 2, // Medium risk
  'EUR-GBP': 1,
};

class StellarRoutingService {
  private readonly horizonUrl = 'https://horizon.stellar.org';

  /**
   * Find payment paths using Horizon's pathfinding API
   */
  async findPaymentPaths(
    sourceAsset: StellarAsset,
    destinationAsset: StellarAsset,
    amount: string,
    type: 'strict-send' | 'strict-receive' = 'strict-send'
  ): Promise<PathPaymentRoute[]> {
    try {
      const params = new URLSearchParams();
      
      if (type === 'strict-send') {
        // Source asset parameters
        params.append('source_amount', amount);
        if (sourceAsset.asset_type === 'native') {
          params.append('source_asset_type', 'native');
        } else {
          params.append('source_asset_type', sourceAsset.asset_type);
          params.append('source_asset_code', sourceAsset.asset_code!);
          params.append('source_asset_issuer', sourceAsset.asset_issuer!);
        }
        
        // Destination asset - use destination_assets format (comma-separated)
        // Format: "native" or "credit_alphanum4:CODE:ISSUER"
        let destinationAssetStr: string;
        if (destinationAsset.asset_type === 'native') {
          destinationAssetStr = 'native';
        } else {
          destinationAssetStr = `${destinationAsset.asset_type}:${destinationAsset.asset_code}:${destinationAsset.asset_issuer}`;
        }
        params.append('destination_assets', destinationAssetStr);
      } else {
        // strict-receive format
        params.append('destination_amount', amount);
        if (destinationAsset.asset_type === 'native') {
          params.append('destination_asset_type', 'native');
        } else {
          params.append('destination_asset_type', destinationAsset.asset_type);
          params.append('destination_asset_code', destinationAsset.asset_code!);
          params.append('destination_asset_issuer', destinationAsset.asset_issuer!);
        }
        
        // Source asset for strict-receive
        let sourceAssetStr: string;
        if (sourceAsset.asset_type === 'native') {
          sourceAssetStr = 'native';
        } else {
          sourceAssetStr = `${sourceAsset.asset_type}:${sourceAsset.asset_code}:${sourceAsset.asset_issuer}`;
        }
        params.append('source_assets', sourceAssetStr);
      }

      const response = await fetch(`${this.horizonUrl}/paths/${type}?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Horizon API error:', errorData);
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data._embedded?.records || [];
    } catch (error) {
      console.error('Error fetching payment paths:', error);
      return [];
    }
  }

  /**
   * Get orderbook data for liquidity analysis
   */
  async getOrderbook(
    sellingAsset: StellarAsset,
    buyingAsset: StellarAsset
  ): Promise<OrderbookData | null> {
    try {
      const params = new URLSearchParams();
      
      if (sellingAsset.asset_type === 'native') {
        params.append('selling_asset_type', 'native');
      } else {
        params.append('selling_asset_type', sellingAsset.asset_type);
        params.append('selling_asset_code', sellingAsset.asset_code!);
        params.append('selling_asset_issuer', sellingAsset.asset_issuer!);
      }
      
      if (buyingAsset.asset_type === 'native') {
        params.append('buying_asset_type', 'native');
      } else {
        params.append('buying_asset_type', buyingAsset.asset_type);
        params.append('buying_asset_code', buyingAsset.asset_code!);
        params.append('buying_asset_issuer', buyingAsset.asset_issuer!);
      }

      const response = await fetch(`${this.horizonUrl}/orderbook?${params}`);
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Error fetching orderbook:', error);
      return null;
    }
  }

  /**
   * Calculate route scores based on multiple factors including real anchor data
   */
  calculateRouteScore(
    route: PathPaymentRoute,
    orderbook?: OrderbookData,
    corridorInfo?: any
  ): RouteScore {
    const hops = route.path.length;
    const sourceAmount = parseFloat(route.source_amount);
    const destinationAmount = parseFloat(route.destination_amount);
    
    // Cost score (lower is better)
    const exchangeRate = destinationAmount / sourceAmount;
    const costScore = Math.max(0, Math.min(5, (1 / exchangeRate) * 100));
    
    // Time score based on hops (more hops = more time)
    const timeScore = Math.min(5, hops * 0.5);
    
    // Risk score based on real corridor data and hops
    const corridorRisk = corridorInfo?.riskScore || 2;
    const riskScore = Math.min(5, corridorRisk + (hops * 0.3));
    
    // Liquidity score from orderbook
    let liquidityScore = 3; // Default
    if (orderbook) {
      const totalBids = orderbook.bids.reduce((sum, bid) => sum + parseFloat(bid.amount), 0);
      const totalAsks = orderbook.asks.reduce((sum, ask) => sum + parseFloat(ask.amount), 0);
      const avgLiquidity = (totalBids + totalAsks) / 2;
      liquidityScore = Math.min(5, Math.max(1, avgLiquidity / 10000));
    }
    
    // Overall score (weighted average)
    const overall = (costScore * 0.4) + (timeScore * 0.2) + (riskScore * 0.3) + (liquidityScore * 0.1);
    
    return {
      cost: costScore,
      time: timeScore,
      risk: riskScore,
      liquidity: liquidityScore,
      overall,
    };
  }

  /**
   * Get corridor risk score
   */
  getCorridorRisk(sourceAsset: string, destinationAsset: string): number {
    const corridorKey = `${sourceAsset}-${destinationAsset}`;
    return CORRIDOR_RISK_SCORES[corridorKey] || 2;
  }

  /**
   * Enhanced route finding with scoring and real anchor data
   */
  async findEnhancedRoutes(
    sourceAsset: StellarAsset,
    destinationAsset: StellarAsset,
    amount: string
  ): Promise<EnhancedRoute[]> {
    const paths = await this.findPaymentPaths(sourceAsset, destinationAsset, amount);
    const orderbook = await this.getOrderbook(sourceAsset, destinationAsset);
    
    // Get corridor information from anchor service
    const corridorInfo = anchorService.getCorridorInfo(
      sourceAsset.asset_code || 'XLM',
      destinationAsset.asset_code || 'XLM'
    );
    
    const enhancedRoutes: EnhancedRoute[] = paths.map((path, index) => {
      const score = this.calculateRouteScore(path, orderbook || undefined, corridorInfo);
      const hops = path.path.length + 1; // +1 for source to first hop
      
      return {
        ...path,
        id: `route-${index}`,
        name: this.generateRouteName(path, corridorInfo),
        hops,
        score,
        slippage: this.calculateSlippage(path, orderbook),
        compliance: this.checkCompliance(path, corridorInfo),
        corridorRisk: corridorInfo.riskScore,
      };
    });

    // Sort by overall score (lower is better)
    return enhancedRoutes.sort((a, b) => a.score.overall - b.score.overall);
  }

  private generateRouteName(route: PathPaymentRoute, corridorInfo?: any): string {
    // Use anchor information to generate more descriptive names
    if (corridorInfo?.anchors?.length > 0) {
      const anchorNames = corridorInfo.anchors.map((a: any) => a.name);
      if (anchorNames.includes('MoneyGram Access')) {
        return 'MoneyGram Route';
      }
      if (anchorNames.includes('Tempo Money Transfer')) {
        return 'Tempo EU Route';
      }
      if (anchorNames.includes('Cowrie Exchange')) {
        return 'Cowrie Nigeria Route';
      }
    }
    
    if (route.path.length === 0) {
      return 'Direct Path';
    } else if (route.path.length === 1) {
      return 'Single Hop';
    } else if (route.path.length <= 3) {
      return 'Multi-Hop FX';
    } else {
      return 'Complex Route';
    }
  }

  private calculateSlippage(route: PathPaymentRoute, orderbook?: OrderbookData): number {
    if (!orderbook || orderbook.asks.length === 0) {
      return 0.5; // Default 0.5% slippage
    }
    
    // Calculate slippage based on orderbook depth
    const topAsk = parseFloat(orderbook.asks[0].price);
    const avgAsk = orderbook.asks.slice(0, 5).reduce((sum, ask) => sum + parseFloat(ask.price), 0) / 5;
    
    return Math.abs((avgAsk - topAsk) / topAsk) * 100;
  }

  private checkCompliance(route: PathPaymentRoute, corridorInfo?: any): boolean {
    // Use real anchor compliance data
    if (corridorInfo?.anchors?.length > 0) {
      const complianceScore = anchorService.calculateComplianceScore(corridorInfo.anchors);
      return complianceScore.score >= 80; // 80% compliance threshold
    }
    
    return true; // Default compliant
  }
}

export const stellarRoutingService = new StellarRoutingService();