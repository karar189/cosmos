export const GARBAGE_COLLECTION_TIME = 10 * 60 * 1000; // 10 minutes
export const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const INTERNAL_ROUTES = {
    TOKEN_BASIC_LIST: (params:string) => `/api/coins/markets?${params}`,
    TOKEN_CHART: (id:string, params:string) => `/api/coins/${id}/chart?${params}`,
    TOKEN_BASIC: (id:string, params:string) => `/api/coins/${id}/details?${params}`,
    EXCHANGE_TRADE_VOLUME_CHART: (exchange_id:string, params:string) => `/api/exchanges/${exchange_id}/trade-volume-chart?${params}`,
};

export const COINGECKO_API_URL = 'https://pro-api.coingecko.com/api/v3';
export const COINGECKO_API_ROUTES = {
    TOKEN_BASIC_LIST: (params:string) => `${COINGECKO_API_URL}/coins/markets?${params}`,
    TOKEN_CHART: (id:string, params:string) => `${COINGECKO_API_URL}/coins/${id}/market_chart?${params}`,
    TOKEN_BASIC: (id:string, params:string) => `${COINGECKO_API_URL}/coins/${id}?${params}`,
    EXCHANGE_TRADE_VOLUME_CHART: (exchange_id:string, params:string) => `${COINGECKO_API_URL}/exchanges/${exchange_id}/volume_chart?${params}`,

}