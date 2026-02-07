'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { ExchangeApiResponse } from '@/types/api/exchange';

// Searchable exchange data type for search modal
export interface SearchableExchange {
  id: string;
  name: string;
  logo?: string;
  rank?: number;
  security: {
    score: number;
    grade: string;
  };
}

// Dynamically import all exchange JSON files from @/data/exchanges
// Using require.context to load all JSON files at build time
// Type declaration for webpack's require.context
interface WebpackRequire {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ): RequireContext;
}

type RequireContext = {
  keys(): string[];
  (id: string): ExchangeApiResponse;
  <T>(id: string): T;
  resolve(id: string): string;
  id: string;
};

const exchangeFilesContext = (require as unknown as WebpackRequire).context(
  '../data/exchanges',
  true,
  /\.json$/
);

// Map exchange IDs to their data
const exchangeDataMap: Record<string, ExchangeApiResponse> = {};

// Load all exchange files into the map
exchangeFilesContext.keys().forEach((fileName: string) => {
  const exchangeData = exchangeFilesContext(fileName) as ExchangeApiResponse;
  if (exchangeData?.exchangeDetails?.id) {
    exchangeDataMap[exchangeData.exchangeDetails.id] = exchangeData;
  }
});

/**
 * Fetch exchange data from local JSON files for the given exchange ID.
 * @param {string} exchangeId - The exchange ID.
 * @returns {Promise<ExchangeApiResponse>} Exchange data.
 */
async function fetchExchangeData(exchangeId: string): Promise<ExchangeApiResponse> {
  const normalizedId = exchangeId.toLowerCase();
  const data = exchangeDataMap[normalizedId];
  if (data) return data as ExchangeApiResponse;
  throw new Error(`Exchange data not found for ID: ${exchangeId}`);
}

/**
 * Options for the React Query fetching exchange data.
 * @param {string} exchangeId - The exchange ID.
 */
export const exchangeDataQueryOptions = (exchangeId: string) =>
  queryOptions({
    queryKey: ['exchange', exchangeId],
    queryFn: () => fetchExchangeData(exchangeId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

/**
 * React Query hook to get exchange data.
 * @param {string} exchangeId - The exchange ID.
 * @returns Query result object.
 */
export function useExchangeData(exchangeId: string) {
  return useQuery(exchangeDataQueryOptions(exchangeId));
}

/**
 * Transform ExchangeApiResponse to search-friendly format
 */
function transformToSearchData(data: ExchangeApiResponse): SearchableExchange {
  return {
    id: data.exchangeDetails.id,
    name: data.exchangeDetails.name,
    logo: data.exchangeDetails.logo,
    rank: data.exchangeDetails.rank,
    security: {
      score: data.exchangeDetails.security?.score?.current || 0,
      grade: data.exchangeDetails.security?.grade?.label || 'N/A',
    },
  };
}

/**
 * Get all exchanges in searchable format
 * In the future, replace with API call: fetch('/api/exchanges/search')
 */
async function fetchAllSearchableExchanges(): Promise<SearchableExchange[]> {
  return Object.values(exchangeDataMap)
    .map((data) => transformToSearchData(data as ExchangeApiResponse))
    .sort((a, b) => b.security.score - a.security.score); // Sort by security score descending
}

/**
 * Search exchanges by query
 * In the future, replace with API call: fetch(`/api/exchanges/search?q=${query}`)
 */
async function searchExchangesApi(query: string): Promise<SearchableExchange[]> {
  if (!query) return [];
  
  const normalizedQuery = query.toLowerCase();
  const allExchanges = await fetchAllSearchableExchanges();
  
  return allExchanges.filter(
    (exchange) =>
      exchange.name.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * React Query hook to get all searchable exchanges
 * Used for trending/default view when no search query
 */
export function useAllSearchableExchanges() {
  return useQuery({
    queryKey: ['searchableExchanges'],
    queryFn: fetchAllSearchableExchanges,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * React Query hook to search exchanges
 * Used when user enters a search query
 */
export function useExchangeSearch(searchQuery: string) {
  return useQuery({
    queryKey: ['exchangeSearch', searchQuery],
    queryFn: () => searchExchangesApi(searchQuery),
    enabled: searchQuery.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Query options for prefetching all searchable exchanges
 * Useful for prefetching data before opening the search modal
 */
export const allSearchableExchangesQueryOptions = () =>
  queryOptions({
    queryKey: ['searchableExchanges'],
    queryFn: fetchAllSearchableExchanges,
    staleTime: 10 * 60 * 1000,
  });

export { fetchExchangeData };


