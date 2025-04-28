import { ChartData } from "chart.js";
import { IRawMarketData } from "../../../interfaces/market-data.interface";

export interface MarketDataState {
    chartData: ChartData<'bar'>;
    timestamps: string[];
    activeTime?: string;
    activeTimeIndex?: number;
    rawData: IRawMarketData[];
    loading: boolean;
    error?: string;
}