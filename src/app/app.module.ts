import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { MarketChartComponent } from './components/market-chart/market-chart.component';
import { ChartControlsComponent } from "./components/chart-controls/chart-controls.component";
import { StoreModule } from "@ngrx/store";
import { marketDataReducer } from "../services/redux/market-data/market-data.reducer";
import { EffectsModule } from "@ngrx/effects";
import { MarketDataEffects } from "../services/redux/market-data/market-data.effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { MarketDataPlaybackEffects } from "../services/redux/market-data-playback/market-data-playback.effects";
import { marketDataPlaybackReducer } from "../services/redux/market-data-playback/market-data-playback.reducer";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        StoreModule.forRoot({ marketData: marketDataReducer, marketDataPlayback: marketDataPlaybackReducer }),
        EffectsModule.forRoot([ MarketDataEffects, MarketDataPlaybackEffects ]),
        StoreDevtoolsModule.instrument({
            maxAge: 25
        }),

        MarketChartComponent,
        ChartControlsComponent
    ],
    providers: [
        provideHttpClient(),
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
