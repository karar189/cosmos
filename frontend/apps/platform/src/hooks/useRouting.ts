/**
 * React hook for Stellar routing functionality
 */

import { useState, useCallback } from 'react';
import { stellarRoutingService, KNOWN_ASSETS, type EnhancedRoute, type StellarAsset } from '@/services/stellar';

export interface RoutingState {
  routes: EnhancedRoute[];
  selectedRoute: EnhancedRoute | null;
  loading: boolean;
  error: string | null;
}

export interface RoutingParams {
  sourceAsset: string;
  destinationAsset: string;
  amount: string;
  routingMode: 'cheapest' | 'fastest' | 'safest' | 'balanced';
}

export function useRouting() {
  const [state, setState] = useState<RoutingState>({
    routes: [],
    selectedRoute: null,
    loading: false,
    error: null,
  });

  const findRoutes = useCallback(async (params: RoutingParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Map asset codes to Stellar asset objects
      const sourceAsset = getAssetByCode(params.sourceAsset);
      const destinationAsset = getAssetByCode(params.destinationAsset);

      if (!sourceAsset || !destinationAsset) {
        throw new Error('Invalid asset selection');
      }

      // Get enhanced routes from Stellar (ensure array)
      const raw = await stellarRoutingService.findEnhancedRoutes(
        sourceAsset,
        destinationAsset,
        params.amount
      );
      const routes = Array.isArray(raw) ? raw : [];

      // Select best route based on routing mode
      let selectedRoute: EnhancedRoute | null = null;
      if (routes.length > 0) {
        selectedRoute = selectBestRoute(routes, params.routingMode);
      }

      setState({
        routes,
        selectedRoute,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to find routes',
      }));
    }
  }, []);

  const selectRoute = useCallback((routeId: string) => {
    setState(prev => ({
      ...prev,
      selectedRoute: prev.routes.find(r => r.id === routeId) || null,
    }));
  }, []);

  return {
    ...state,
    findRoutes,
    selectRoute,
  };
}

function getAssetByCode(assetCode: string): StellarAsset | null {
  switch (assetCode.toUpperCase()) {
    case 'XLM':
      return KNOWN_ASSETS.XLM_NATIVE;
    case 'USDC':
      return KNOWN_ASSETS.USDC_CIRCLE;
    case 'USDT':
      return KNOWN_ASSETS.USDT_TETHER;
    case 'EUR':
      return KNOWN_ASSETS.EUR_TEMPO;
    default:
      return null;
  }
}

function getScore(route: EnhancedRoute) {
  const s = route?.score;
  return {
    cost: typeof s?.cost === 'number' ? s.cost : 0,
    time: typeof s?.time === 'number' ? s.time : 0,
    risk: typeof s?.risk === 'number' ? s.risk : 0,
    overall: typeof s?.overall === 'number' ? s.overall : 0,
  };
}

function selectBestRoute(routes: EnhancedRoute[], mode: string): EnhancedRoute {
  if (!routes?.length) return routes[0];
  const first = routes[0];
  switch (mode) {
    case 'cheapest':
      return routes.reduce((prev, curr) =>
        getScore(curr).cost < getScore(prev).cost ? curr : prev
      );
    case 'fastest':
      return routes.reduce((prev, curr) =>
        getScore(curr).time < getScore(prev).time ? curr : prev
      );
    case 'safest':
      return routes.reduce((prev, curr) =>
        getScore(curr).risk < getScore(prev).risk ? curr : prev
      );
    case 'balanced':
    default:
      return routes.reduce((prev, curr) =>
        getScore(curr).overall < getScore(prev).overall ? curr : prev
      );
  }
}