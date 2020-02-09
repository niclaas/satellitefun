import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SatelliteModel } from '../../models/satellite.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-satellite-detail',
  templateUrl: './satellite-detail-modal.component.html',
  styleUrls: ['./satellite-detail-modal.component.css']
})
export class SatelliteDetailModalComponent {
  @Input() satellite: SatelliteModel;

  constructor(public activeModal: NgbActiveModal) { }
}
