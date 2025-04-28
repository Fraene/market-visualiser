import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { goToSeries, goToSeriesPlayback, loadMarketDataSuccess, nextSeries, previousSeries } from "../market-data/market-data.actions";
import { filter, map, switchMap, takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { initializeMarketDataPlayback, marketDataPlaybackTick, startMarketDataPlayback, stopMarketDataPlayback } from "./market-data-playback.actions";
import { interval } from "rxjs";
import { Store } from "@ngrx/store";
import { selectPlaybackPosition, selectThresholds } from "./market-data-playback.selectors";
import { selectActiveTimeIndex } from "../market-data/market-data.selectors";
import { ENV } from "../../../env/environment";

@Injectable()
export class MarketDataPlaybackEffects {
    public initializePlayback;
    public stopPlayback;
    public startPlayback;
    public checkPlaybackCompletion;
    public updateActiveDataset;

    constructor(
        private actions: Actions,
        private store: Store
    ) {
        this.initializePlayback = createEffect(() => this.actions.pipe(
            ofType(loadMarketDataSuccess),
            map(({ data }) => initializeMarketDataPlayback({ data }))
        ));

        this.stopPlayback = createEffect(() => this.actions.pipe(
            ofType(nextSeries, previousSeries, goToSeries),
            map(() => stopMarketDataPlayback())
        ));

        this.startPlayback = createEffect(() => this.actions.pipe(
            ofType(startMarketDataPlayback),
            tap(() => this.store.dispatch(goToSeriesPlayback({ index: 0 }))),
            switchMap(() => {
                const frameTime = 1 / ENV.playback.tickRate;

                return interval(frameTime * 1000).pipe(
                    map(() => marketDataPlaybackTick()),
                    takeUntil(this.actions.pipe(ofType(stopMarketDataPlayback)))
                );
            })
        ));

        this.checkPlaybackCompletion = createEffect(() => this.actions.pipe(
            ofType(marketDataPlaybackTick),
            withLatestFrom(this.store.select(selectPlaybackPosition)),
            filter(([, position]) => position >= 1),
            map(() => stopMarketDataPlayback())
        ));

        this.updateActiveDataset = createEffect(() => this.actions.pipe(
            ofType(marketDataPlaybackTick),
            withLatestFrom(
                this.store.select(selectPlaybackPosition),
                this.store.select(selectThresholds),
                this.store.select(selectActiveTimeIndex)
            ),
            filter(([, position, thresholds, activeTimeIndex]) => position >= thresholds[activeTimeIndex!]),
            map(([,,, activeTimeIndex]) => goToSeriesPlayback({ index: activeTimeIndex! + 1 }))
        ));
    }
}