import { Component, effect, Input, ViewChild } from '@angular/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { MarketDataService } from '../../../services/market-data.service';

@Component({
    selector: 'mv-market-chart',
    templateUrl: './market-chart.component.html',
    styleUrls: ['./market-chart.component.scss'],
    standalone: true,
    imports: [ BaseChartDirective ],
    providers: [ provideCharts(withDefaultRegisterables()) ]
})
export class MarketChartComponent {
    @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

    public data!: ChartData<'bar'>;
    public chartOptions: ChartOptions<'bar'> = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        },
        scales: {
            y: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Price'
                },
                ticks: {
                    stepSize: 0.0005
                }
            },
            x: {
                type: 'linear',
                stacked: true,
                // min: -10000,
                // max: 10000,
                title: {
                    display: true,
                    text: 'Size'
                }
            }
        }
    };

    constructor(
        public marketDataService: MarketDataService
    ) {
        effect(() => {
            this.data = this.marketDataService.chartData();
            setTimeout(() => this.chart?.update(), 100);
        });
    }
}
