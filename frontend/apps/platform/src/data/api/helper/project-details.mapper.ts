import { CoinDetailResponse, TokenPriceData } from '../types/coin_gecko/coin_details';

const calculateProjectAge = (genesisDate: string | null): number => {
    if (!genesisDate) return 0;
    const genesis = new Date(genesisDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - genesis.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
}

export const mapProjectDetails = (data: CoinDetailResponse): TokenPriceData => {
    const result: TokenPriceData = {
        symbol: data.id,
        current_price: data.market_data.current_price.usd,
        market_cap: data.market_data.market_cap.usd,
        market_cap_change_24h: data.market_data.market_cap_change_24h_in_currency.usd,
        market_cap_change_percentage_24h: data.market_data.market_cap_change_percentage_24h_in_currency.usd,
        price_change_percentage_24h: data.market_data.price_change_percentage_24h,
        project_age: calculateProjectAge(data.genesis_date),
        high: data.market_data.high_24h.usd,
        low: data.market_data.low_24h.usd,
        allTimeHigh: {
            price: data.market_data.ath.usd.toString(),
            date: new Date(data.market_data.ath_date.usd),
            changePercent: data.market_data.ath_change_percentage.usd.toString(),
        },
        allTimeLow: {
            price: data.market_data.atl.usd.toString(),
            date: new Date(data.market_data.atl_date.usd),
            changePercent: data.market_data.atl_change_percentage.usd.toString(),
        },
    }
    return result
}