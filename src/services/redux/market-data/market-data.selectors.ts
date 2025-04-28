import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MarketDataState } from "./market-data.state";

export const selectMarketDataState = createFeatureSelector<MarketDataState>('marketData');

export const selectChartData = createSelector(selectMarketDataState, state => state.chartData);
export const selectTimestamps = createSelector(selectMarketDataState, state => state.timestamps);
export const selectActiveTime = createSelector(selectMarketDataState, state => state.activeTime);
export const selectActiveTimeIndex = createSelector(selectMarketDataState, state => state.activeTimeIndex);
export const selectLoading = createSelector(selectMarketDataState, state => state.loading);
export const selectError = createSelector(selectMarketDataState, state => state.error);