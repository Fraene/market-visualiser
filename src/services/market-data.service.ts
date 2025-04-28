import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";
import { goToSeries, loadMarketData, nextSeries, previousSeries } from "./redux/market-data/market-data.actions";
import { selectActiveTime, selectActiveTimeIndex, selectChartData, selectError, selectLoading, selectTimestamps } from "./redux/market-data/market-data.selectors";

@Injectable({
    providedIn: 'root'
})
export class MarketDataService {
    public readonly chartData$;
    public readonly timestamps$;
    public readonly activeTime$;
    public readonly activeTimeIndex$;

    public readonly loading$;
    public readonly error$;

    constructor(
        private store: Store
    ){
        this.chartData$ = this.store.select(selectChartData);
        this.timestamps$ = this.store.select(selectTimestamps);
        this.activeTime$ = this.store.select(selectActiveTime);
        this.activeTimeIndex$ = this.store.select(selectActiveTimeIndex);
        this.loading$ = this.store.select(selectLoading);
        this.error$ = this.store.select(selectError);
    }

    public fetchData(){
        this.store.dispatch(loadMarketData());
    }

    public nextSeries(){
        this.store.dispatch(nextSeries());
    }

    public prevSeries(){
        this.store.dispatch(previousSeries());
    }

    public goToSeries(index: number){
        this.store.dispatch(goToSeries({ index }));
    }
}
