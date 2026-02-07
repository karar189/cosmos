export interface ExchangeTradingChartProps {
    exchange_id: string;       // Exchange ID (slug), e.g. "binance"
    days: string;              // Data up to number of days ago (e.g. 1,14,30,max)
}

export type ExchangeTradingVolumeResponse = Array<[number, string]>;

export interface ExchangeTradingChartPoint {
    timestamp: number;         // Unix timestamp in milliseconds
    date: Date;                // Date object
    volume: number;            // Trading volume at that timestamp
}

export type ExchangeTradingChartData = ExchangeTradingChartPoint[];