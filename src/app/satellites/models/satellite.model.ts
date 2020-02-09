import { SatelliteOrbitModel } from './satellite-orbit.model';
import { SatellitePathPositionModel } from './satellite-path-position.model';

export class SatelliteModel {
    public orbit: SatelliteOrbitModel;
    public path: SatellitePathPositionModel[];
    public id: number;
    public prn: number;
    public displayName: string;
    public constellation: string;
}
  