import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectNormalisedIntervals, selectPlaybackDuration, selectPlaybackPosition, selectPlaybackRunning } from "./redux/market-data-playback/market-data-playback.selectors";
import { startMarketDataPlayback, stopMarketDataPlayback } from "./redux/market-data-playback/market-data-playback.actions";

@Injectable({
    providedIn: 'root'
})
export class MarketDataPlaybackService {
    public readonly playbackDuration$;
    public readonly playbackPosition$;
    public readonly playbackRunning$;
    public readonly normalisedIntervals$;

    constructor(
        private store: Store
    ) {
        this.playbackDuration$ = this.store.select(selectPlaybackDuration);
        this.playbackPosition$ = this.store.select(selectPlaybackPosition);
        this.playbackRunning$ = this.store.select(selectPlaybackRunning);
        this.normalisedIntervals$ = this.store.select(selectNormalisedIntervals);
    }

    public startPlayback(duration?: number){
        this.store.dispatch(startMarketDataPlayback({ duration }));
    }

    public stopPlayback(){
        this.store.dispatch(stopMarketDataPlayback());
    }
}