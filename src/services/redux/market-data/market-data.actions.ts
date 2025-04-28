import { createAction, props } from "@ngrx/store";
import { IRawMarketData } from "../../../interfaces/market-data.interface";

export const loadMarketData = createAction('[MarketData] Load Market Data');
export const loadMarketDataSuccess = createAction('[MarketData] Load Market Data Success', props<{ data: IRawMarketData[] }>());
export const loadMarketDataFailure = createAction('[MarketData] Load Market Data Failure', props<{ error: string }>());

export const nextSeries = createAction('[MarketData] Next Series');
export const previousSeries = createAction('[MarketData] Previous Series');
export const goToSeries = createAction('[MarketData] Go To Series', props<{ index: number }>());
export const goToSeriesPlayback = createAction('[MarketData] Go To Series (Playback)', props<{ index: number }>());