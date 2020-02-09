import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'coordinateDirection'})
export class coordinateDirectionPipe implements PipeTransform {

  transform(value: number, coordinateType: string): string {
    let dir: string;
    if (coordinateType == 'lat') {
      dir = value > 0 ? ' N' : ' S';
    }
    else {
      dir = value > 0 ? ' E' : ' W';
    }

    return this.getDegreesMinutesSeconds(value) + dir;
  }

  getDegreesMinutesSeconds(coordinate: number): string {
    let direction: string = '';

    if (coordinate < 0) {
      coordinate = -1 * coordinate;
    }

    var degRemainder = coordinate % 1;
    var degrees = Math.floor(coordinate);

    var minRemainder = (degRemainder * 60) % 1;
    var minutes = Math.floor(degRemainder * 60);

    var secRemainder = (minRemainder * 60) % 1;
    var seconds = Math.floor(minRemainder * 60);
    
    direction += degrees + '°' + minutes + '\'' + seconds + '\'\'';

    return direction;
  }
}