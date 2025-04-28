import { Component, OnDestroy, ViewChild } from '@angular/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { MarketDataService } from '../../../services/market-data.service';
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: 'mv-market-chart',
    templateUrl: './market-chart.component.html',
    styleUrls: ['./market-chart.component.scss'],
    standalone: true,
    imports: [ BaseChartDirective ],
    providers: [ provideCharts(withDefaultRegisterables()) ]
})
export class MarketChartComponent implements OnDestroy {
    @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

    public data!: ChartData<'bar'>;
    public chartOptions: ChartOptions<'bar'> = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: ctx => `${ctx.dataset.label}: ${Math.abs(ctx.parsed.x).toLocaleString()}`
                }
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
                title: {
                    display: true,
                    text: 'Size'
                },
                ticks: {
                    callback: value => Math.abs(<number>value).toLocaleString()
                }
            }
        }
    };

    private destroy$ = new Subject<void>();

    constructor(
        private marketDataService: MarketDataService
    ) {
        this.marketDataService.chartData$.pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.data = structuredClone(data);
            this.determineMaxValues();
            this.chart?.chart?.update('none');
        });
    }

    public ngOnDestroy(){
        this.destroy$.next();
        this.destroy$.complete();
    }

    private determineMaxValues(){
        const maxAsk = Math.max(...(<number[]>this.data.datasets[0].data.map(x => x ?? 0)));
        const maxBid = Math.abs(Math.min(...(<number[]>this.data.datasets[1].data.map(x => x ?? 0))));

        this.chartOptions = {
            ...this.chartOptions,
            scales: {
                ...this.chartOptions.scales,
                x: {
                    ...this.chartOptions.scales?.['x'],
                    max: Math.max(maxAsk, maxBid),
                    min: -Math.max(maxAsk, maxBid)
                }
            }
        };
    }
}
