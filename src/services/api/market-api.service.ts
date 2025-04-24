import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRawMarketData } from '../../interfaces/market-data.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MarketAPIService {
    constructor(
        private http: HttpClient
    ){}

    public fetchMarketData(): Observable<IRawMarketData[]> {
        return this.http.get<IRawMarketData[]>('sample.json');
    }
}
