/**
 * TanStack Query hooks for CoinGecko API
 */

import { useQueries, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { 
  CoinDetailResponse, 
  TokenPriceData, 
  requestOptions 
} from './types/coin_gecko/coin_details';
import { 
    CoinMarketChartResponse,
  MarketChartRangeParams, 
  TransformedChartData 
} from './types/coin_gecko/coin_historical';
import api from './api.util';
import { transformMarketChartRangeData } from './helper/project-historical.mapper';
import { mapProjectDetails } from './helper/project-details.mapper';
import { TokenDetailListResponseItem, TokenDetailsListParams } from './types/coin_gecko/coin_details_list';
import exchangeDetails from '@/data/exchange_trade_volume.json'
import { ExchangeDetails } from './types/coin_gecko/exchage_details';
import { GARBAGE_COLLECTION_TIME, INTERNAL_ROUTES, STALE_TIME } from '@/constants/api';
import { ExchangeTradingChartData, ExchangeTradingChartProps, ExchangeTradingVolumeResponse } from './types/coin_gecko/exchange_historical';
/**
 * Query Keys for CoinGecko API
 */
export const coinGeckoKeys = {
  all: ['coinGecko'] as const,
  tokens: () => [...coinGeckoKeys.all, 'tokens'] as const,
  token: (symbol: string) => [...coinGeckoKeys.tokens(), symbol] as const,
  tokenBasic: (symbol: string, options: requestOptions) => 
    [...coinGeckoKeys.token(symbol), 'basic', options] as const,
  tokenBasicList: (options: TokenDetailsListParams) => 
    [...coinGeckoKeys.tokens(), 'basicList', options] as const,
  charts: () => [...coinGeckoKeys.all, 'charts'] as const,
  tokenChart: (symbol: string, options: MarketChartRangeParams) => 
    [...coinGeckoKeys.charts(), symbol, options] as const,
  exchangeTradeList: (names?: string[]) => 
    [...coinGeckoKeys.all, 'exchangeTradeList', names] as const,
  exchangeTradeDetails: (name: string) =>
    [...coinGeckoKeys.all, 'exchangeTradeDetails', name] as const,
  exchangeTradeChart: (name: string, options: ExchangeTradingChartProps) => 
    [...coinGeckoKeys.all, 'exchangeTradeChart', name, options] as const,
};

/**
 * Hook to fetch token basic information
 * 
 * @param symbol - Token symbol (e.g., 'bitcoin', 'ethereum')
 * @param options - Request options for data filtering
 * @param queryOptions - TanStack Query options
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useTokenBasic('bitcoin', {
 *   market_data: true,
 *   sparkline: false
 * });
 * ```
 */
export function useTokenBasic(
  symbol: string,
  options: requestOptions = {
    localization: false,
    tickers: false,
    market_data: true,
    community_data: false,
    developer_data: false,
    sparkline: false,
    dax_pair_format: 'symbol',
  },
    queryOptions?: Omit<
    UseQueryOptions<TokenPriceData, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: coinGeckoKeys.tokenBasic(symbol, options),
    queryFn: async (): Promise<TokenPriceData> => {
        try {
            const params = new URLSearchParams();
            params.append('localization', String(options.localization));
            params.append('tickers', String(options.tickers));
            params.append('market_data', String(options.market_data));
            params.append('community_data', String(options.community_data));
            params.append('developer_data', String(options.developer_data));
            params.append('sparkline', String(options.sparkline));
            if (options.dax_pair_format) {
              params.append('dax_pair_format', options.dax_pair_format);
            }
            
            // Call CoinGecko directly - api.util will auto-proxy through server
            const response = await api.get<CoinDetailResponse>(INTERNAL_ROUTES.TOKEN_BASIC(symbol, params.toString()));
            const result = mapProjectDetails(response.data);
            return result;
        }  catch (error) {
            console.error('Error fetching token basic info from CoinGecko:', error);
            throw error;
        }
    },
    staleTime: STALE_TIME, // 2 minutes
    gcTime: GARBAGE_COLLECTION_TIME, // 5 minutes
    ...queryOptions,
  });
}

/**
 * Hook to fetch token historical chart data
 * 
 * @param symbol - Token symbol (e.g., 'bitcoin', 'ethereum')
 * @param options - Market chart range parameters
 * @param queryOptions - TanStack Query options
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useTokenChart('bitcoin', {
 *   vs_currency: 'usd',
 *   from: startTimestamp,
 *   to: endTimestamp,
 *   interval: 'daily'
 * });
 * ```
 */
export function useTokenChart(
  options: MarketChartRangeParams,
  queryOptions?: Omit<
    UseQueryOptions<TransformedChartData, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: coinGeckoKeys.tokenChart(options.id, options),
    queryFn: async () => {
        try {
            const params = new URLSearchParams();
            params.append('vs_currency', options.vs_currency);
            params.append('days', String(options.days));
            if (options.interval) {
              params.append('interval', options.interval);
            }
            
            // Call CoinGecko directly - api.util will auto-proxy through server
            const response = await api.get<CoinMarketChartResponse>(INTERNAL_ROUTES.TOKEN_CHART(options.id, params.toString()));
            return transformMarketChartRangeData(response.data);
        }  catch (error) {
            console.error('Error fetching token chart from CoinGecko:', error);
            throw error;
        }
    },
    staleTime: STALE_TIME, // 5 minutes
    gcTime: GARBAGE_COLLECTION_TIME, // 5 minutes
    ...queryOptions,
  });
}

/**
 * Hook to fetch token list with automatic pagination handling
 * Automatically splits requests into multiple pages if total items exceed 250
 * 
 * @param options - Token details list parameters
 * @param queryOptions - TanStack Query options
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useTokenBasicListPaginated({
 *   vs_currency: 'usd',
 *   names: ['bitcoin', 'ethereum', ...], // Can be > 250
 * });
 * ```
 */
export function useTokenBasicListPaginated(
  options: Omit<TokenDetailsListParams, 'per_page' | 'page'>,
  queryOptions?: Omit<
    UseQueryOptions<TokenDetailListResponseItem[], Error>,
    'queryKey' | 'queryFn'
  >
) {
  const MAX_PER_PAGE = 250;
  
  // Calculate total items based on provided arrays
  const totalItems = options.ids?.length || options.names?.length || 0;
  // Calculate number of pages needed
  const totalPages = Math.ceil(totalItems / MAX_PER_PAGE);
  
  // Create array of page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Execute multiple queries in parallel
  const queries = useQueries({
    queries: pages.map((page) => {
      // Calculate slice indices for this page
      const startIndex = (page - 1) * MAX_PER_PAGE;
      const endIndex = startIndex + MAX_PER_PAGE;
      
      // Slice the arrays for this page
      const pageOptions: TokenDetailsListParams = {
        ...options,
        per_page: MAX_PER_PAGE,
        page: 1, // Always use page 1 since we're slicing the data ourselves
        ids: options.ids?.slice(startIndex, endIndex),
        names: options.names?.slice(startIndex, endIndex),
      };
      
      return {
        queryKey: [...coinGeckoKeys.tokenBasicList(pageOptions), 'paginated', page],
        queryFn: async (): Promise<TokenDetailListResponseItem[]> => {
          try {
            const params = new URLSearchParams();
            params.append('vs_currency', pageOptions.vs_currency);
            if (pageOptions.ids && pageOptions.ids.length > 0) {
              params.append('ids', pageOptions.ids.join(','));
            }
            if (pageOptions.names && pageOptions.names.length > 0) {
              params.append('names', pageOptions.names.join(','));
            }
            params.append('per_page', String(pageOptions.per_page));
            params.append('page', String(pageOptions.page));
            if (pageOptions.price_change_percentage) {
              params.append('price_change_percentage', pageOptions.price_change_percentage.join(','));
            }
            
            const response = await api.get<TokenDetailListResponseItem[]>(
              INTERNAL_ROUTES.TOKEN_BASIC_LIST(params.toString())
            );
            return response.data;
          } catch (error) {
            console.error(`Error fetching token list page ${page}:`, error);
            throw error;
          }
        },
        staleTime: STALE_TIME, // 5 minutes
        gcTime: GARBAGE_COLLECTION_TIME, // 5 minutes
        ...queryOptions,
      };
    }),
  });
  
  // Combine results from all queries
  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);
  const error = queries.find((q) => q.error)?.error;
  
  // Flatten all results into a single array
  const data = queries.every((q) => q.data)
    ? queries.flatMap((q) => q.data || [])
    : undefined;
  
  return {
    data,
    isLoading,
    isError,
    error,
    queries, // Expose individual queries for advanced use cases
  };
}

/**
 * Hook to fetch exchange trading volume details
 * @param names - Optional list of exchange names to filter 
 * @param queryOptions - TanStack Query options 
 * @returns
 */
export function useExchangeTradeList(
  names?: string[],
  queryOptions?: Omit<
    UseQueryOptions<ExchangeDetails[], Error>,
    'queryKey' | 'queryFn'
  >
) {
  
  return useQuery({
    queryKey: ['exchangeTradeList', names],
    queryFn: async (): Promise<ExchangeDetails[]> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        let exchanges: ExchangeDetails[] = exchangeDetails;
        if (names && names.length > 0) {
            exchanges = exchanges.filter((ex) => names.includes(ex.name));
        }
        return exchanges;
    },
    staleTime: STALE_TIME, // 5 minutes
    gcTime: GARBAGE_COLLECTION_TIME, // 10 minutes (formerly cacheTime)
    ...queryOptions,
  }); 
}

export function useExchangeTradeDetails(
  name: string,
  queryOptions?: Omit<
    UseQueryOptions<ExchangeDetails, Error>,
    'queryKey' | 'queryFn'
  >
) {
  
  return useQuery({
    queryKey: ['exchangeTradeDetails', name],
    queryFn: async (): Promise<ExchangeDetails> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const exchanges: ExchangeDetails[] = exchangeDetails;
        const exchange = exchanges.filter((ex) => ex.name === name);
        if (exchange.length > 0) {
            return exchange[0];
        }
        throw new Error(`Exchange with name ${name} not found`);
  },
    staleTime: STALE_TIME, // 5 minutes
    gcTime: GARBAGE_COLLECTION_TIME, // 10 minutes (formerly cacheTime)
    ...queryOptions,
  }); 
}
/**
 * Hook to fetch exchange trading volume chart data
 * @param options - Exchange trading chart properties
 * @param queryOptions - TanStack Query options 
 * @returns 
 */
export function useExchangeTradingChart(
  options: ExchangeTradingChartProps,
  queryOptions?: Omit<
    UseQueryOptions<ExchangeTradingChartData, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: coinGeckoKeys.exchangeTradeChart(options.exchange_id, options),
    queryFn: async () => {
        try {
            const params = new URLSearchParams();
            params.append('days', options.days);
            
            // Call CoinGecko directly - api.util will auto-proxy through server
            const response = await api.get<ExchangeTradingVolumeResponse>(INTERNAL_ROUTES.EXCHANGE_TRADE_VOLUME_CHART(options.exchange_id, params.toString()));
            return response.data.map((item) => ({
                timestamp: item[0],
                date: new Date(item[0]),
                volume: parseFloat(item[1]),
            }));
        }  catch (error) {
            console.error('Error fetching token chart from CoinGecko:', error);
            throw error;
        }
    },
    staleTime: STALE_TIME, // 5 minutes
    gcTime: GARBAGE_COLLECTION_TIME, // 5 minutes
    ...queryOptions,
  });
}