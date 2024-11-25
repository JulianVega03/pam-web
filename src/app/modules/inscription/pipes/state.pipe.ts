import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'state'
})
export class StatePipe implements PipeTransform {

  transform(value: number): string {
    const states: {[key:number]: string} = {
        1: 'NO SE HA SUBIDO',
        2: 'ENVIADO',
        3: 'RECHAZADO',
        4: 'APROBADO ',
      }
    return states[value];
  }

}
