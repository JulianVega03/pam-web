import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtService } from '../../auth/services/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AspiranteService {
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: this._jwtService.getToken(),
    }),
  };

  constructor(private http: HttpClient, private _jwtService: JwtService) {}

  public obtenerInfoAspirante(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/aspirante/obtener`, this.httpOptions);
  }

  public listAdmitidos(): Observable<any> {
    return this.http.get(
      `${environment.apiBaseUrl}/aspirante/admitidos`,
      this.httpOptions
    );
  }

  public admitirAspirante(aspiranteId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/aspirante/admitir`;

    const params = new HttpParams({
      fromObject: {
        aspiranteId: aspiranteId.toString(),
      },
    });

    return this.http.post(url, params, {
      headers: new HttpHeaders({ Authorization: '' }),
    });
  }

  public listCalificacionesPorAspirante(): Observable<any> {
    return this.http.get(
      `${environment.apiBaseUrl}/aspirante/listarCalificaciones`,
      this.httpOptions
    );
  }

  public listHistoricoCohortes(cohorteId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/aspirante/historicos`;

    const params = new HttpParams({
      fromObject: {
        cohorteId: cohorteId,
      },
    });

    const options = {
      headers: new HttpHeaders({ Authorization: '' }),
      params: params,
    };

    return this.http.get(url, options);
  }

  public listarCalificacionesPorAspiranteId(
    aspiranteId: number
  ): Observable<any> {
    const url = `${environment.apiBaseUrl}/aspirante/calificacionesAspirante`;

    const params = new HttpParams({
      fromObject: {
        aspiranteId: aspiranteId,
      },
    });

    const options = {
      headers: new HttpHeaders({ Authorization: '' }),
      params: params,
    };

    return this.http.get(url, options);
  }

  public getInformacionAspirante(id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/aspirante/info`;

    const params = new HttpParams({
      fromObject: {
        id: id,
      },
    });

    const options = {
      headers: new HttpHeaders({ Authorization: this._jwtService.getToken() }),
      params: params,
    };

    return this.http.get(url, options);
  }

  public rechazarAdmision(aspiranteId: number){
    const url = `${environment.apiBaseUrl}/aspirante/rechazarAdmision`;

    const params = new HttpParams({
      fromObject: {
        aspiranteId: aspiranteId.toString(),
      },
    });

    return this.http.post(url, params, {
      headers: new HttpHeaders({ Authorization: '' }),
    });
  }
}
