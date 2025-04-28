export interface  MarketDataPlaybackState {
    playbackDuration: number;
    normalisedIntervals: number[];
    thresholds: number[];
    playbackPosition: number;
    playbackRunning: boolean;
}