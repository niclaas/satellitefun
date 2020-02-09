import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SatelliteModel } from '../../models/satellite.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SatelliteDetailModalComponent } from '../detail/satellite-detail-modal.component';
import { SatelliteService, Coordinates } from '../../satellite.service';
import { materialize } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [SatelliteService, DecimalPipe]
})
export class MapComponent implements OnInit {

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  
  satellites$: Observable<SatelliteModel[]>;
  currentCoordinates$: Observable<Coordinates>;
  map: google.maps.Map;
  mapOptions: google.maps.MapOptions;
  currentPosMarker: google.maps.Marker;
  currentCoordinates: Coordinates;
  satellites: SatelliteModel[];
  satelliteMarkers: google.maps.Marker[] = [];

  constellationColours: (string | null)[] = [];
  constellations: (string | null)[] = [];
 
  public visibleOnly: boolean = false;

  constructor(private router: Router, private httpClient: HttpClient,
    private modalService: NgbModal, public service: SatelliteService) {
    this.satellites$ = this.service.satellites$;
    this.currentCoordinates$ = this.service.currentCoordinates$;

    this.service.initialize(this.visibleOnly, 500);
  }

  ngOnInit() {
    this.currentCoordinates$.subscribe(result => {
      if (result) {
        this.currentCoordinates = result;
        this.checkCreateMap();
        this.setCurrentPos();
      }
    });

    this.satellites$.subscribe(result => {
      if (result && result.length > 0) {
        this.satellites = result;
        this.checkCreateMap();
        this.setSatPositions();
      }
    });
  }


  notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
  }

  getConstellationColoursCleaned(): string[] {
    return this.constellationColours.filter(this.notEmpty);
  }

  getConstellationsCleaned(): string[] {
    return this.constellations.filter(this.notEmpty);
  }

  toggleVisible() {
    this.visibleOnly = !this.visibleOnly;
    this.service.initialize(this.visibleOnly, 500);
  }

  checkCreateMap() {
    if (typeof this.map === "undefined") {
      this.mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 3
      };

      this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    }
  }

  setCurrentPos() {
    if (this.currentCoordinates && this.satellites) {
      let coords = new google.maps.LatLng(this.currentCoordinates.lat, this.currentCoordinates.lng);
      let marker = new google.maps.Marker({
        position: coords,
        map: this.map
      });
      marker.setMap(this.map);
    }
  }

  getConstellationColour(c: string): string {
    let charPos = c.charCodeAt(0) - 64;
    if (this.constellationColours[charPos]) {
      return this.constellationColours[charPos];
    }
    else {
      let g = Math.floor(Math.random() * 255);
      let b = Math.floor(Math.random() * 255);
      this.constellationColours[charPos] = 'rgb(0, ' + g + ', ' + b + ')';
      this.constellations[charPos] = c;
      return this.constellationColours[charPos];
    }
  }

  getPin(c: string, healthy: boolean): google.maps.Symbol {
    return {
      path: 'M 0,0 L -43.3,-75 A 50 50 1 1 1 43.30,-75 L 0,0 z',
      fillColor: healthy ? this.getConstellationColour(c) : 'rgb(200, 0, 0)',
      fillOpacity: 0.8,
      scale: 0.25,
      strokeColor: healthy ? 'rgb(0, 180, 0)' : 'rgb(180, 0, 0)',
      strokeWeight: 1,
      labelOrigin: new google.maps.Point(0, -100)
    };
  }

  getGoogleLatLng(sat: SatelliteModel): google.maps.LatLng {
    return new google.maps.LatLng(sat.path[0].trace.latitude, sat.path[0].trace.longitude);
  }

  setSatPositions() {
    let self = this;

    this.satelliteMarkers.forEach(element => {
      element.setMap(null);
    });

    if (this.satellites) {
      for (let i = 0; i < this.satellites.length; i++) {
        let sat = this.satellites[i];
        let marker: google.maps.Marker;

        marker = this.satelliteMarkers[sat.id];
        if (!marker) {
          marker = new google.maps.Marker({
            icon: this.getPin(sat.constellation, sat.orbit.isHealthy),
            map: this.map,
            label: this.satellites[i].displayName
          });
          this.satelliteMarkers[sat.id] = marker;
        }

        marker.setPosition(this.getGoogleLatLng(sat));
        marker.setMap(this.map);

        marker.addListener('click', function() {
            const modalRef = self.modalService.open(SatelliteDetailModalComponent);
            modalRef.componentInstance.satellite = sat;
        });
      }
    }
  }
}

