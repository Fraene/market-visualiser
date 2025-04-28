import { Component } from '@angular/core';
import { MarketDataService } from '../services/market-data.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false,
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'MarketVisualiser';

    public loading: boolean = true;
    public error?: string;

    constructor(
        private marketDataService: MarketDataService
    ) {
        this.marketDataService.fetchData();

        this.marketDataService.loading$.subscribe(loading => this.loading = loading);
        this.marketDataService.error$.subscribe(error => this.error = error);
    }
}
