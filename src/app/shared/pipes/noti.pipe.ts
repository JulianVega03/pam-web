import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noti'
})
export class NotiPipe implements PipeTransform {

  private MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  private DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

  transform(date: string): string {
    const dateT = new Date(date);

    return `${this.DAYS[dateT.getDay()]} ${dateT.getDate()} de ${this.MONTHS[dateT.getMonth()]} del ${dateT.getFullYear()} a las ${dateT.toTimeString().split(' ')[0]} `;
  }

}
