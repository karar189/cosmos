export type PriceChartPoint = {
  date: string;
  value: number;
};

export type PriceLineChartProps = {
  data: PriceChartPoint[];
  yDomain?: [number, number];
  yTicks?: number[];
};

