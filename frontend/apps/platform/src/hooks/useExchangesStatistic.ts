'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { ExchangesStatisticApiResponse } from '@/types/api/exchangesStatistic';

// Import exchanges statistic JSON file
import exchangesStatisticData from '@/data/exchanges_statistic.json';

/**
 * Fetch exchanges statistic data from local JSON file.
 * @returns {Promise<ExchangesStatisticApiResponse>} Exchanges statistic data.
 */
async function fetchExchangesStatistic(): Promise<ExchangesStatisticApiResponse> {
  return exchangesStatisticData;
}

/**
 * Options for the React Query fetching exchanges statistic.
 */
export const exchangesStatisticQueryOptions = () =>
  queryOptions({
    queryKey: ['exchangesStatistic'],
    queryFn: () => fetchExchangesStatistic(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

/**
 * React Query hook to get exchanges statistic data.
 * @returns Query result object.
 */
export function useExchangesStatistic() {
  return useQuery(exchangesStatisticQueryOptions());
}

export { fetchExchangesStatistic };


