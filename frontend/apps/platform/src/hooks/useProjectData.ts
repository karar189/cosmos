'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { ProjectApiResponse } from '@/types/api/project';
import type { ProjectData } from '@/components/common/SearchModal/types';

// Import all project JSON files
import aaveData from '@/data/projects/AAVE.json';
import aleoData from '@/data/projects/Aleo.json';
import aptosData from '@/data/projects/Aptos.json';
import arbitrumData from '@/data/projects/Arbitrum.json';
import asterData from '@/data/projects/Aster.json';
import axieInfinityData from '@/data/projects/AxieInfinity.json';
import baycData from '@/data/projects/BAYC.json';
import benqiData from '@/data/projects/Benqi.json';
import bnbData from '@/data/projects/BNB.json';
import celestiaData from '@/data/projects/Celestia.json';
import chainlinkData from '@/data/projects/Chainlink.json';
import decentralandData from '@/data/projects/Decentraland.json';
import dogecoinData from '@/data/projects/Dogecoin.json';
import espressoSequencerData from '@/data/projects/EspressoSequencer.json';
import ethenaData from '@/data/projects/Ethena.json';
import etherFiData from '@/data/projects/Ether.fi.json';
import ethereumData from '@/data/projects/Ethereum.json';
import filecoinData from '@/data/projects/Filecoin.json';
import flokiData from '@/data/projects/Floki.json';
import gelatoData from '@/data/projects/Gelato.json';
import gmxData from '@/data/projects/GMX.json';
import heliumData from '@/data/projects/Helium.json';
import hivemapperData from '@/data/projects/Hivemapper.json';
import hyperliquidData from '@/data/projects/Hyperliquid.json';
import internetComputerData from '@/data/projects/Internet Computer.json';
import layerZeroData from '@/data/projects/LayerZero.json';
import lineaData from '@/data/projects/Linea.json';
import mantleData from '@/data/projects/Mantle.json';
import meteoraData from '@/data/projects/Meteora.json';
import moneroData from '@/data/projects/Monero.json';
import officialTrumpData from '@/data/projects/Official Trump.json';
import ondoFinanceData from '@/data/projects/Ondo Finance.json';
import optimismData from '@/data/projects/Optimism.json';
import oraichainData from '@/data/projects/Oraichain.json';
import pepeData from '@/data/projects/Pepe.json';
import piNetworkData from '@/data/projects/Pi Network.json';
import plasmaData from '@/data/projects/Plasma.json';
import pumpFunData from '@/data/projects/Pump.fun.json';
import realtData from '@/data/projects/RealT.json';
import renderData from '@/data/projects/Render.json';
import secretNetworkData from '@/data/projects/Secret Network.json';
import starknetData from '@/data/projects/Starknet.json';
import synapseData from '@/data/projects/Synapse.json';
import ultraUosData from '@/data/projects/Ultra_UOS.json';
import uniswapData from '@/data/projects/Uniswap.json';
import worldLibertyFinancialData from '@/data/projects/World Liberty Financial.json';
import worldcoinData from '@/data/projects/Worldcoin.json';
import zcashData from '@/data/projects/Zcash.json';
import zksyncData from '@/data/projects/ZKsync.json';

// Map project IDs to their data (lowercase keys for case-insensitive lookup)
const projectDataMap: Record<string, unknown> = {
  [aaveData.projectDetails.id]: aaveData,
  [aleoData.projectDetails.id]: aleoData,
  [aptosData.projectDetails.id]: aptosData,
  [arbitrumData.projectDetails.id]: arbitrumData,
  [asterData.projectDetails.id]: asterData,
  [axieInfinityData.projectDetails.id]: axieInfinityData,
  [baycData.projectDetails.id]: baycData,
  [benqiData.projectDetails.id]: benqiData,
  [bnbData.projectDetails.id]: bnbData,
  [celestiaData.projectDetails.id]: celestiaData,
  [chainlinkData.projectDetails.id]: chainlinkData,
  [decentralandData.projectDetails.id]: decentralandData,
  [dogecoinData.projectDetails.id]: dogecoinData,
  [espressoSequencerData.projectDetails.id]: espressoSequencerData,
  [ethenaData.projectDetails.id]: ethenaData,
  [etherFiData.projectDetails.id]: etherFiData,
  [ethereumData.projectDetails.id]: ethereumData,
  [filecoinData.projectDetails.id]: filecoinData,
  [flokiData.projectDetails.id]: flokiData,
  [gelatoData.projectDetails.id]: gelatoData,
  [gmxData.projectDetails.id]: gmxData,
  [heliumData.projectDetails.id]: heliumData,
  [hivemapperData.projectDetails.id]: hivemapperData,
  [hyperliquidData.projectDetails.id]: hyperliquidData,
  [internetComputerData.projectDetails.id]: internetComputerData,
  [layerZeroData.projectDetails.id]: layerZeroData,
  [lineaData.projectDetails.id]: lineaData,
  [mantleData.projectDetails.id]: mantleData,
  [meteoraData.projectDetails.id]: meteoraData,
  [moneroData.projectDetails.id]: moneroData,
  [officialTrumpData.projectDetails.id]: officialTrumpData,
  [ondoFinanceData.projectDetails.id]: ondoFinanceData,
  [optimismData.projectDetails.id]: optimismData,
  [oraichainData.projectDetails.id]: oraichainData,
  [pepeData.projectDetails.id]: pepeData,
  [piNetworkData.projectDetails.id]: piNetworkData,
  [plasmaData.projectDetails.id]: plasmaData,
  [pumpFunData.projectDetails.id]: pumpFunData,
  [realtData.projectDetails.id]: realtData,
  [renderData.projectDetails.id]: renderData,
  [secretNetworkData.projectDetails.id]: secretNetworkData,
  [starknetData.projectDetails.id]: starknetData,
  [synapseData.projectDetails.id]: synapseData,
  [ultraUosData.projectDetails.id]: ultraUosData,
  [uniswapData.projectDetails.id]: uniswapData,
  [worldLibertyFinancialData.projectDetails.id]: worldLibertyFinancialData,
  [worldcoinData.projectDetails.id]: worldcoinData,
  [zcashData.projectDetails.id]: zcashData,
  [zksyncData.projectDetails.id]: zksyncData,
};

/**
 * Fetch project data from local JSON files for the given project ID.
 * @param {string} projectId - The project ID.
 * @returns {Promise<ProjectApiResponse>} Project data.
 */
async function fetchProjectData(projectId: string): Promise<ProjectApiResponse> {
  const normalizedId = projectId.toLowerCase();
  const data = projectDataMap[normalizedId];
  if (data) return data as ProjectApiResponse;
  throw new Error(`Project data not found for ID: ${projectId}`);
}

/**
 * Options for the React Query fetching project data.
 * @param {string} projectId - The project ID.
 */
export const projectDataQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: ['project', projectId],
    queryFn: () => fetchProjectData(projectId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

/**
 * React Query hook to get project data.
 * @param {string} projectId - The project ID.
 * @returns Query result object.
 */
export function useProjectData(projectId: string) {
  return useQuery(projectDataQueryOptions(projectId));
}

/**
 * Transform ProjectApiResponse to SearchModal-friendly format
 */
function transformToSearchData(data: ProjectApiResponse): ProjectData {
  return {
    id: data.projectDetails.id,
    project: data.projectDetails.name,
    chain: data.projectDetails.chains?.[0]?.name || data.projectDetails.ticker || '',
    logo: data.projectDetails.logo,
    ticker: data.projectDetails.ticker,
    category: data.projectDetails.category,
    pol: {
      score: data.probabilityOfLoss?.score?.current || 0,
      grade: data.probabilityOfLoss?.grade?.label || 'N/A',
      confidence: data.probabilityOfLoss?.confidence,
    },
    certification: data.projectDetails.certification,
    dataCoverage: data.probabilityOfLoss?.dataCoverage,
  };
}

/**
 * Get all projects in searchable format
 * In the future, replace with API call: fetch('/api/projects/search')
 */
async function fetchAllSearchableProjects(): Promise<ProjectData[]> {
  return Object.values(projectDataMap).map((data) => 
    transformToSearchData(data as ProjectApiResponse)
  );
}

/**
 * Search projects by query
 * In the future, replace with API call: fetch(`/api/projects/search?q=${query}`)
 */
async function searchProjectsApi(query: string): Promise<ProjectData[]> {
  if (!query) return [];
  
  const normalizedQuery = query.toLowerCase();
  const allProjects = await fetchAllSearchableProjects();
  
  return allProjects.filter(
    (project) =>
      project.project.toLowerCase().includes(normalizedQuery) ||
      project.chain.toLowerCase().includes(normalizedQuery) ||
      project.category?.toLowerCase().includes(normalizedQuery) ||
      project.ticker?.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * React Query hook to get all searchable projects
 * Used for trending/default view when no search query
 */
export function useAllSearchableProjects() {
  return useQuery({
    queryKey: ['searchableProjects'],
    queryFn: fetchAllSearchableProjects,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });
}

/**
 * React Query hook to search projects
 * Used when user enters a search query
 */
export function useProjectSearch(searchQuery: string) {
  return useQuery({
    queryKey: ['projectSearch', searchQuery],
    queryFn: () => searchProjectsApi(searchQuery),
    enabled: searchQuery.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Query options for prefetching all searchable projects
 * Useful for prefetching data before opening the search modal
 */
export const allSearchableProjectsQueryOptions = () =>
  queryOptions({
    queryKey: ['searchableProjects'],
    queryFn: fetchAllSearchableProjects,
    staleTime: 10 * 60 * 1000,
  });

export { fetchProjectData };
