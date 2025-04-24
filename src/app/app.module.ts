import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { MarketChartComponent } from './components/market-chart/market-chart.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MarketChartComponent
    ],
    providers: [
        provideHttpClient(),
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
