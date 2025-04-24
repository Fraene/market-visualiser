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

    constructor(
        private marketDataService: MarketDataService
    ) {
        this.marketDataService.fetchData();
    }
}
