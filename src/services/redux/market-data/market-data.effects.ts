import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { MarketAPIService } from "../../api/market-api.service";
import { loadMarketData, loadMarketDataFailure, loadMarketDataSuccess } from "./market-data.actions";
import { catchError, map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class MarketDataEffects {
    public loadMarketData;

    constructor(
        private actions: Actions,
        private marketApi: MarketAPIService
    ) {
        this.loadMarketData = createEffect(() => this.actions.pipe(
            ofType(loadMarketData),
            mergeMap(() => this.marketApi.fetchMarketData().pipe(
                map(data => loadMarketDataSuccess({ data })),
                catchError(error => of(loadMarketDataFailure({ error })))
            ))
        ));
    }
}