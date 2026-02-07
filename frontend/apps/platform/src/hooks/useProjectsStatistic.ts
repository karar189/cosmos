'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { ProjectsStatisticApiResponse } from '@/types/api/projectsStatistic';

// Import projects statistic JSON file
import projectsStatisticData from '@/data/projects_statistic.json';

/**
 * Fetch projects statistic data from local JSON file.
 * @returns {Promise<ProjectsStatisticApiResponse>} Projects statistic data.
 */
async function fetchProjectsStatistic(): Promise<ProjectsStatisticApiResponse> {
  return projectsStatisticData as ProjectsStatisticApiResponse;
}

/**
 * Options for the React Query fetching projects statistic.
 */
export const projectsStatisticQueryOptions = () =>
  queryOptions({
    queryKey: ['projectsStatistic'],
    queryFn: () => fetchProjectsStatistic(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

/**
 * React Query hook to get projects statistic data.
 * @returns Query result object.
 */
export function useProjectsStatistic() {
  return useQuery(projectsStatisticQueryOptions());
}

export { fetchProjectsStatistic };
