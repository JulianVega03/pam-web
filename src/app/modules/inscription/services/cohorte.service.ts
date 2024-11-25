import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { Cohorte } from 'src/app/data/interfaces/cohorte.interface';
import { environment } from 'src/environments/environment';
import { JwtService } from '../../auth/services/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class CohorteService {
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: this.jwt.getToken(),
    }),
  };

  private _currentCohorte: BehaviorSubject<Cohorte | null> =
    new BehaviorSubject<Cohorte | null>(null);

  constructor(private http: HttpClient, private jwt: JwtService) {
    this.openCohorte();
  }

  /**
   * Método get que me devuelve como un observable el cohorte actual abierto si existe
   */
  public get currentCohorte() {
    return this._currentCohorte.asObservable();
  }

  public get isOpenCohorte() {
    return this._currentCohorte.value !== null;
  }

  /**
   * Método para obtener la lista de cohortes (historicos)
   * @returns Un observable con la lista de cohortes
   */
  public cohortesList(): Observable<Cohorte[]> {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/cohorte`,
      this.httpOptions
    );
  }

  /**
   * Método para cerrar el cohorte actual.
   * @returns observable con la respuesta del backend cuando se cierra un cohorte
   */
  public closeCurrentCohorte() {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/cohorte/cerrar`,
        null,
        this.httpOptions
      )
      .pipe(
        tap((response) => {
          this._currentCohorte.next(null);
        })
      );
  }

  /**
   * Método para abrir una nueva cohorte
   * @param {fecha_inicio, fecha_fin} las fechas de inicio y fin del cohorte .
   * @returns un observable con la respuesta del backend cuando se abre una cohorte.
   */
  public openNewCohorte({
    fechaInicio,
    fechaFin,
  }: {
    fechaInicio: Date;
    fechaFin: Date;
  }) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/cohorte/abrir`,
      { fechaInicio, fechaFin },
      this.httpOptions
    );
  }

  /**
   * Método para obtener el cohorte actualmente abierto.
   */
  public openCohorte(): Observable<any> {
    this.http
      .get<any>(`${environment.apiBaseUrl}/cohorte/abierto`, this.httpOptions)
      .subscribe({
        next: (cohorte) => {
          this._currentCohorte.next(cohorte);
        },
        error: (err) => {
          this._currentCohorte.next(null);
          console.log(err, 'en error del cohorte')
        },
      });
      return this.http
      .get<any>(`${environment.apiBaseUrl}/cohorte/abierto`)
  }

  /**
   * Método para actualizar la fecha de cierre del cohorte actual.
   * @param nuevaFechaFin fecha de actualizacion para el cierre del cohorte
   * @returns observable con la respuesta del backend
   */
  public editCloseDate(fechaFin: Date){
    // const nuevaFechaFin = fechaFin.toISOString().split('T')[0]
    // console.log(nuevaFechaFin)
    const httpParams = new HttpParams().append('nuevaFechaFin', fechaFin.toISOString().split('T')[0])
    return this.http.put(`${environment.apiBaseUrl}/cohorte/fechaFin`,httpParams, {headers: this.httpOptions.headers})
  }
}
