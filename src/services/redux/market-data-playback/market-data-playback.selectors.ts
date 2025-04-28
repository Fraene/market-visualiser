import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MarketDataPlaybackState } from "./market-data-playback.state";

export const selectMarketDataPlaybackState = createFeatureSelector<MarketDataPlaybackState>('marketDataPlayback');

export const selectPlaybackRunning = createSelector(selectMarketDataPlaybackState, state => state.playbackRunning);
export const selectPlaybackPosition = createSelector(selectMarketDataPlaybackState, state => state.playbackPosition);
export const selectPlaybackDuration = createSelector(selectMarketDataPlaybackState, state => state.playbackDuration);
export const selectNormalisedIntervals = createSelector(selectMarketDataPlaybackState, state => state.normalisedIntervals);
export const selectThresholds = createSelector(selectMarketDataPlaybackState, state => state.thresholds);