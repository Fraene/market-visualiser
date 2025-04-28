import { MarketDataState } from "./market-data.state";
import { createReducer, on } from "@ngrx/store";
import { goToSeries, goToSeriesPlayback, loadMarketData, loadMarketDataFailure, loadMarketDataSuccess, nextSeries, previousSeries } from "./market-data.actions";

export const initialState: MarketDataState = {
    chartData: {
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
    },
    timestamps: [],
    rawData: [],
    loading: false
};

export const marketDataReducer = createReducer(
    initialState,
    on(loadMarketData, state => ({
        ...state,
        loading: true,
        error: undefined
    })),
    on(loadMarketDataSuccess, (state, { data }) => {
        const timestamps = data.map(x => x.Time).sort();
        const timeIndex = timestamps.indexOf(state.activeTime ?? '');

        const activeTime = timeIndex === -1 ? timestamps[0] : timestamps[timeIndex];
        const activeTimeIndex = timeIndex === -1 ? 0 : timeIndex;

        return {
            ...state,
            rawData: data,
            timestamps,
            activeTime,
            activeTimeIndex,
            loading: false,
            chartData: buildChartData(data.find(x => x.Time === activeTime))
        };
    }),
    on(loadMarketDataFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(nextSeries, state => {
        if(state.activeTimeIndex === state.timestamps.length - 1)
            return state;
        const activeTimeIndex = state.activeTimeIndex === undefined ? 0 : state.activeTimeIndex + 1;
        const activeTime = state.timestamps[activeTimeIndex];

        return {
            ...state,
            activeTime,
            activeTimeIndex,
            chartData: buildChartData(state.rawData.find(x => x.Time === activeTime))
        };
    }),
    on(previousSeries, state => {
        if(state.activeTimeIndex === 0)
            return state;
        const activeTimeIndex = state.activeTimeIndex === undefined ? 0 : state.activeTimeIndex - 1;
        const activeTime = state.timestamps[activeTimeIndex];

        return {
            ...state,
            activeTime,
            activeTimeIndex,
            chartData: buildChartData(state.rawData.find(x => x.Time === activeTime))
        };
    }),
    on(goToSeries, goToSeriesPlayback, (state, { index }) => {
        if(index < 0 || index >= state.timestamps.length)
            return state;

        const activeTime = state.timestamps[index];

        return {
            ...state,
            activeTime,
            activeTimeIndex: index,
            chartData: buildChartData(state.rawData.find(x => x.Time === activeTime))
        }
    })
);

const buildChartData = (rawData?: any) => {
    if(!rawData)
        return initialState.chartData;

    const labels = [];
    const asks = [];
    const bids = [];

    for (let i = 1; i <= 10; i++) {
        const label = rawData[`Ask${i}`];
        const size = rawData[`Ask${i}Size`];

        labels.push(label);
        asks.push(size);
        bids.push(0);
    }

    for (let i = 1; i <= 10; i++) {
        const label = rawData[`Bid${i}`];
        const size = rawData[`Bid${i}Size`];

        const exLabel = labels.indexOf(label);

        if (exLabel !== -1) {
            bids[exLabel] += -size;
        } else {
            labels.push(label);
            bids.push(-size);
            asks.push(0);
        }
    }

    return {
        labels,
        datasets: [
            {
                label: 'Asks',
                data: asks,
                stack: '0'
            },
            {
                label: 'Bids',
                data: bids,
                stack: '0'
            }
        ]
    };
}