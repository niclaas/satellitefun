import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SatelliteModel } from '../../models/satellite.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SatelliteDetailModalComponent } from '../detail/satellite-detail-modal.component';
import { SatelliteService } from '../../satellite.service';
import { NgbdSortableHeader, SortEvent } from '../../../shared/directives/sortable.directive';

@Component({
  selector: 'app-satellites',
  templateUrl: './satellites.component.html',
  styleUrls: ['./satellites.component.css'],
  providers: [SatelliteService, DecimalPipe]
})
export class SatellitesComponent implements OnInit {

  satellites$: Observable<SatelliteModel[]>;
  total$: Observable<number>;

  lat$: Observable<number>;
  lng$: Observable<number>;
  height$: Observable<number>;

  constructor(private router: Router, private httpClient: HttpClient, 
    private modalService: NgbModal, public service: SatelliteService) { 
      this.satellites$ = this.service.satellites$;
      this.total$ = this.service.total$;
    
      this.lat$ = this.service.lat$;
      this.lng$ = this.service.lng$;
      this.height$ = this.service.height$;

      this.service.initialize(this.router.url.endsWith('visible'));
    }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  ngOnInit() {    
  }

  onSort({column, direction}: SortEvent) {
    // reset the other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  showAll() {
    return !this.router.url.endsWith('visible');
  }

  open(satellite) {
    const modalRef = this.modalService.open(SatelliteDetailModalComponent);
    modalRef.componentInstance.satellite = satellite;
  }
}