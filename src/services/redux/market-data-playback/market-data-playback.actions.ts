import { createAction, props } from "@ngrx/store";
import { IRawMarketData } from "../../../interfaces/market-data.interface";

export const initializeMarketDataPlayback = createAction("[Market Data Playback] Initialize Market Data Playback", props<{ data: IRawMarketData[] }>());
export const startMarketDataPlayback = createAction("[Market Data Playback] Start Market Data Playback", props<{ duration?: number }>());
export const stopMarketDataPlayback = createAction("[Market Data Playback] Stop Market Data Playback");
export const marketDataPlaybackTick = createAction("[Market Data Playback] Market Data Playback Tick");
