import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ColombianState, ColombianStatesAndCities } from '../interfaces/colombian-states';

@Injectable({
  providedIn: 'root',
})
export class StatesService {
  private statesUrl = 'https://www.datos.gov.co/resource/xdk5-pm3f.json';
  private townsUrl = 'https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json';

  constructor(private http: HttpClient) {}

  getState(): Observable<ColombianState[]> {
    return this.http.get<ColombianState[]>(`${this.statesUrl}`);
  }

  getTowns(): Observable<ColombianStatesAndCities[]> {
    return this.http.get<ColombianStatesAndCities[]>(`${this.townsUrl}`);
  }
}
