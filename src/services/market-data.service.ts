import { Injectable, signal } from '@angular/core';
import { IRawMarketData } from '../interfaces/market-data.interface';
import { MarketAPIService } from './api/market-api.service';
import { ChartData } from 'chart.js';

@Injectable({
    providedIn: 'root'
})
export class MarketDataService {
    public chartData = signal<ChartData<'bar'>>({
        labels: [],
        datasets: [
            {
                label: 'Asks',
                data: [],
                stack: '0'
            },
            {
                label: 'Bids',
                data: [],
                stack: '0'
            }
        ]
    });
    public timestamps = signal<string[]>([]);

    private rawData: IRawMarketData[] = [];

    private activeTime?: string;

    constructor(
        private api: MarketAPIService
    ){}

    public fetchData(){
        this.api.fetchMarketData().subscribe({
            next: data => {
                this.rawData = data;

                if(!this.activeTime){
                    this.activeTime = data[0].Time;
                }

                this.buildChartData();
            }
        });
    }

    private buildChartData(){
        let rawData: any = this.rawData.find(x => x.Time === this.activeTime);

        if(!rawData)
            return;

        let labels = [];
        let asks = [];
        let bids = [];

        for(let i = 1; i <= 10; i++){
            let label = rawData[`Ask${i}`];
            let size = rawData[`Ask${i}Size`];

            labels.push(label);
            asks.push(size);
            bids.push(0);
        }
        for(let i = 1; i <= 10; i++){
            let label = rawData[`Bid${i}`];
            let size = rawData[`Bid${i}Size`];

            let exLabel = labels.indexOf(label);

            if(exLabel !== -1){
                bids[exLabel] += -size;
            } else {
                labels.push(label);
                bids.push(-size);
                asks.push(0);
            }
        }

        this.chartData.update(val => {
            val.labels = labels;
            val.datasets[0].data = asks;
            val.datasets[1].data = bids;

            return val;
        });
    }

    private buildTimestamps(){
        this.timestamps.set(this.rawData.map(x => x.Time));
    }
}
