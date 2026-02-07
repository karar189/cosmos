'use client';

import { useMemo } from 'react';
import { useExchangeTradeList } from '@/data/api/coinGecko.queries';
import type { ExchangeListItem } from '@/types/api/exchangesStatistic';

/**
 * Custom hook to merge exchanges list with their trade volume data from CoinGecko.
 * 
 * @param exchangesList - Array of exchanges to enrich with trade volume data
 * @returns {Object} - Object containing merged exchanges list and loading state
 * @returns {ExchangeListItem[]} .exchangeList - Exchanges with trade volume data
 * @returns {boolean} .isLoading - Loading state from CoinGecko API
 */
export function useExchangesWithTradeVolume(exchangesList: ExchangeListItem[]) {
  // Extract exchange names for API query
  const exchangeNames = useMemo(
    () => exchangesList.map(exchange => exchange.exchange.name),
    [exchangesList]
  );

  // Fetch trade volume data from CoinGecko
  const { data: exchangeDetailList, isLoading } = useExchangeTradeList(
    exchangeNames,
    {
      enabled: exchangesList.length > 0,
    }
  );

  // Merge exchanges with their trade volume data
  const mergedExchangeList = useMemo(() => {
    if (!exchangeDetailList || exchangesList.length === 0) {
      return exchangesList;
    }

    return exchangesList.map(exchange => {
      const exchangeData = exchangeDetailList.find(
        item => item.name.toLowerCase() === exchange.exchange.name.toLowerCase()
      );

      if (exchangeData) {
        return {
          ...exchange,
          tradeVolume: {
            trade_volume_24h: exchangeData.trade_volume_24h,
            trade_volume_change_24h: exchangeData.trade_volume_change_24h,
            trade_volume_change_percentage_24h: exchangeData.trade_volume_change_percentage_24h,
          },
        };
      }

      return exchange;
    });
  }, [exchangeDetailList, exchangesList]);

  return {
    mergedExchangeList,
    isLoading,
  };
}
