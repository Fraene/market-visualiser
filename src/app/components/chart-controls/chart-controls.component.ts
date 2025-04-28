import { Component, OnDestroy, ViewChild } from "@angular/core";
import { MarketDataService } from "../../../services/market-data.service";
import { ActiveElement, Chart, ChartData, ChartEvent, ChartOptions } from "chart.js";
import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from "ng2-charts";
import { DateTime } from "luxon";
import { MarketDataPlaybackService } from "../../../services/market-data-playback.service";
import { Subject, takeUntil } from "rxjs";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'mv-chart-controls',
    templateUrl: './chart-controls.component.html',
    imports: [ BaseChartDirective, FormsModule ],
    providers: [ provideCharts(withDefaultRegisterables(annotationPlugin)) ],
    styleUrls: ['./chart-controls.component.scss']
})
export class ChartControlsComponent implements OnDestroy {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    public timestamps!: string[];
    public activeTime?: string;
    public activeTimeIndex?: number;

    public playbackProgress = 0;
    public playbackRunning = false;

    public duration = 90;

    public chartData: ChartData<'scatter'> = {
        datasets: [{
            data: [],
            pointStyle: 'rect',
            pointRadius: 5,
            pointBackgroundColor: ctx => {
                const idx = ctx.dataIndex;
                return this.activeTimeIndex === idx ? '#FA09' : '#0AF9';
            },
            pointBorderColor: ctx => {
                const idx = ctx.dataIndex;
                return this.activeTimeIndex === idx ? '#FA0' : '#0AF';
            }
        }]
    };
    public chartOptions: ChartOptions<'scatter'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                ticks: {
                    callback: val => DateTime.fromMillis(<number>val).toFormat('HH:mm:ss')
                }
            },
            y: {
                display: false
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: ctx => DateTime.fromMillis(<number>ctx.parsed.x).toFormat('HH:mm:ss.SSS')
                }
            },
            annotation: {
                annotations: {
                    verticalLine: {
                        type: 'line',
                        scaleID: 'x',
                        value: ctx => {
                            const scale = ctx.chart.scales['x'];

                            return scale.min + (scale.max - scale.min) * this.playbackProgress;
                        },
                        borderColor: '#F00',
                        borderWidth: 1,
                        drawTime: 'beforeDatasetsDraw',
                        display: ctx => this.playbackRunning,
                    }
                }
            }
        },
        onClick: (event: ChartEvent, elements: ActiveElement[])=> {
            if(elements.length === 0)
                return;

            const idx = elements[0].index;

            this.marketDataService.goToSeries(idx);
        }
    };

    private readonly destroy$ = new Subject<void>();

    constructor(
        private marketDataService: MarketDataService,
        private marketDataPlaybackService: MarketDataPlaybackService
    ){
        this.marketDataService.timestamps$.pipe(takeUntil(this.destroy$)).subscribe(timestamps => {
            this.timestamps = timestamps;
            // @ts-ignore
            this.chartData.datasets[0].data = timestamps.map(x => ({ x: (DateTime.fromFormat(x.substring(0, 12), 'HH:mm:ss.SSS')).toISO(), y: 1 }));
            this.chart?.chart?.update('none');
        });
        this.marketDataService.activeTime$.pipe(takeUntil(this.destroy$)).subscribe(activeTime => this.activeTime = activeTime);
        this.marketDataService.activeTimeIndex$.pipe(takeUntil(this.destroy$)).subscribe(activeTimeIndex => {
            this.activeTimeIndex = activeTimeIndex;
            this.chart?.chart?.update('none');
        });

        this.marketDataPlaybackService.playbackPosition$.pipe(takeUntil(this.destroy$)).subscribe(position => {
            this.playbackProgress = position;
            this.chart?.chart?.update('none');
        });
        this.marketDataPlaybackService.playbackRunning$.pipe(takeUntil(this.destroy$)).subscribe(running => {
            this.playbackRunning = running;
            this.chart?.chart?.update('none');
        });
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public goNext(){
        this.marketDataService.nextSeries();
    }

    public goPrev(){
        this.marketDataService.prevSeries();
    }

    public startPlayback(){
        this.marketDataPlaybackService.startPlayback(this.duration);
    }

    public stopPlayback(){
        this.marketDataPlaybackService.stopPlayback();
    }
}