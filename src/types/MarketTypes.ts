export interface DataProps {
  current_price: number;
  symbol: string;
  name: string;
  id: string;
  price_change_percentage_24h: number;
  price_change_24h: number;
  total_volume: number;
  sparkline_in_7d: {price: number[]};
}

export type DataPoint = {
  date: Date;
  value: number;
};
export interface GraphData {
  min: number;
  max: number;
  curve: any;
}
