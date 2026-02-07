'use client';

import { useMemo } from 'react';
import { useTokenBasicListPaginated } from '@/data/api/coinGecko.queries';
import type { ProjectListItem } from '@/types/api/projectsStatistic';

/**
 * Custom hook to merge projects list with their market data from CoinGecko.
 * 
 * @param projectsList - Array of projects to enrich with market data
 * @returns {Object} - Object containing merged projects list and loading state
 * @returns {ProjectListItem[]} .projectRatings - Projects with market data
 * @returns {boolean} .isLoading - Loading state from CoinGecko API
 */
export function useProjectsWithMarketData(projectsList: ProjectListItem[]) {
  // Extract project names for API query
  const projectNames = useMemo(
    () => projectsList.map(project => project.project.name),
    [projectsList]
  );

  // Fetch market data from CoinGecko
  const { data: tokenDetailList, isLoading } = useTokenBasicListPaginated(
    {
      vs_currency: 'usd',
      names: projectNames,
    },
    {
      enabled: projectsList.length > 0,
    }
  );

  // Merge projects with their market data
  const mergedProjectRatings = useMemo(() => {
    if (!tokenDetailList || projectsList.length === 0) {
      return projectsList;
    }

    return projectsList.map(project => {
      const tokenData = tokenDetailList.find(
        token => token.name.toLowerCase() === project.project.name.toLowerCase()
      );

      if (tokenData) {
        return {
          ...project,
          marketData: {
            market_cap: tokenData.market_cap,
            market_cap_change_24h: tokenData.market_cap_change_24h,
            market_cap_change_percentage_24h: tokenData.market_cap_change_percentage_24h,
          },
        };
      }

      return project;
    });
  }, [tokenDetailList, projectsList]);

  return {
    mergedProjectRatings,
    isLoading,
  };
}
