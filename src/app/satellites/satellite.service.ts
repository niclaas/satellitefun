import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortDirection } from '../shared/directives/sortable.directive';

import { SatelliteModel } from './models/satellite.model';

interface SearchResult {
    satellites: SatelliteModel[];
    total: number;
}

interface State {
    masterList: SatelliteModel[];
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: string;
    sortDirection: SortDirection;
}

export interface Coordinates {
    lat: number;
    lng: number;
    height: number;
}

function compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(satellites: SatelliteModel[], column: string, direction: string): SatelliteModel[] {
    if (direction === '') {
        return satellites;
    } else {
        return [...satellites].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(satellite: SatelliteModel, term: string, pipe: PipeTransform) {
    return satellite.displayName.toLowerCase().includes(term.toLowerCase());
}

@Injectable({ providedIn: 'root' })
export class SatelliteService {

    private _currentCoordinates$ = new BehaviorSubject<Coordinates>(null);
    private _lat$ = new BehaviorSubject<number>(0);
    private _lng$ = new BehaviorSubject<number>(0);
    private _height$ = new BehaviorSubject<number>(0);

    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _satellites$ = new BehaviorSubject<SatelliteModel[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
        masterList: null,
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    constructor(private pipe: DecimalPipe, private httpClient: HttpClient) {
        this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search()),
            delay(200),
            tap(() => this._loading$.next(false))
        ).subscribe(result => {
            this._satellites$.next(result.satellites);
            this._total$.next(result.total);
        });
    }

    get currentCoordinates$() { return this._currentCoordinates$.asObservable(); }
    get lat$() { return this._lat$.asObservable(); }
    get lng$() { return this._lng$.asObservable(); }
    get height$() { return this._height$.asObservable(); }

    get satellites$() { return this._satellites$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get searchTerm() { return this._state.searchTerm; }

    set masterList(masterList: SatelliteModel[]) { this._set({ masterList }); }
    set page(page: number) { this._set({ page }); }
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
    set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

    public initialize(visibleOnly: boolean, pageSize: number = 10) {

        this._set({ pageSize }, false)

        if (!visibleOnly) {
            this.fetchSatellitesData('https://gnssplanningbeta.azurewebsites.net/api/SatelliteLocations');
        }
        else {
            if (navigator) {
                navigator.geolocation.getCurrentPosition(pos => {
                    this._lat$.next(+pos.coords.latitude);
                    this._lng$.next(+pos.coords.longitude);
                    this._height$.next(+pos.coords.altitude);

                    this._currentCoordinates$.next({lat: +pos.coords.latitude, lng: +pos.coords.longitude, height: +pos.coords.altitude});

                    this.fetchSatellitesData('https://gnssplanningbeta.azurewebsites.net/api/SatelliteLocations/VisibleFrom/' + +pos.coords.latitude + '/' + +pos.coords.longitude + '/' + +pos.coords.altitude);
                });
            }
        }
    }

    private fetchSatellitesData(url) {
        const headers = new HttpHeaders()
            .append('accept', 'application/json');

        const options = { headers };

        this.httpClient.get<SatelliteModel[]>(url, options)
            .subscribe(
                (data) => {
                    this.masterList = data;
                },
                error => {
                    console.log("Error fetching list of satellites");
                }
            );
    }

    private _set(patch: Partial<State>, triggerSearch: boolean = true) {
        Object.assign(this._state, patch);
        if (triggerSearch) {
            this._search$.next();
        }
    }

    private _search(): Observable<SearchResult> {
        const { masterList, sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

        // 1. sort
        let satellites = sort(masterList, sortColumn, sortDirection);

        // 2. filter
        satellites = satellites.filter(country => matches(country, searchTerm, this.pipe));
        const total = satellites.length;

        // 3. paginate
        satellites = satellites.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({ satellites, total });
    }
}