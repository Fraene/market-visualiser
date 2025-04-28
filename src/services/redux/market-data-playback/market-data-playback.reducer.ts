import { MarketDataPlaybackState } from "./market-data-playback.state";
import { createReducer, on } from "@ngrx/store";
import { initializeMarketDataPlayback, marketDataPlaybackTick, startMarketDataPlayback, stopMarketDataPlayback } from "./market-data-playback.actions";
import { IRawMarketData } from "../../../interfaces/market-data.interface";
import { DateTime } from "luxon";
import { ENV } from "../../../env/environment";

export const initialState: MarketDataPlaybackState = {
    playbackDuration: 50,
    normalisedIntervals: [],
    thresholds: [],
    playbackPosition: 0,
    playbackRunning: false,
}

export const marketDataPlaybackReducer = createReducer(
    initialState,
    on(initializeMarketDataPlayback, (state, { data }) => {
        const [ normalisedIntervals, thresholds ] = calculateNormalisedIntervals(data);

        return {
            ...state,
            thresholds,
            normalisedIntervals
        };
    }),
    on(startMarketDataPlayback, (state, { duration }) => {
        return {
            ...state,
            playbackRunning: true,
            playbackDuration: duration ?? state.playbackDuration,
            playbackPosition: 0
        };
    }),
    on(stopMarketDataPlayback, state => {
        if(!state.playbackRunning)
            return state;

        return {
            ...state,
            playbackRunning: false
        }
    }),
    on(marketDataPlaybackTick, state => {
        if(!state.playbackRunning)
            return state;

        const progressPerTick = 1 / state.playbackDuration / ENV.playback.tickRate;

        return {
            ...state,
            playbackPosition: state.playbackPosition + progressPerTick
        }
    })
);

const calculateNormalisedIntervals = (data: IRawMarketData[]): [ number[], number[] ] => {
    const intervals: number[] = [];
    const thresholds: number[] = [];
    let currThreshold = 0;
    const timestamps = data.map(x => DateTime.fromFormat(x.Time.substring(0, 12), 'HH:mm:ss.SSS').toUnixInteger()).sort();

    const duration = timestamps[timestamps.length - 1] - timestamps[0];

    for (let i = 0; i < timestamps.length - 1; i++) {
        const interval = timestamps[i + 1] - timestamps[i];
        intervals.push(interval / duration);
        currThreshold += intervals[i];
        thresholds.push(currThreshold);
    }

    return [ intervals, thresholds ];
}