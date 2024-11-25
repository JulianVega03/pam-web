import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notificacion } from 'src/app/data/interfaces/notificacion.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private http: HttpClient) {}

  /**
   * Método para obtener la lista de notificaciones del aspirante.
   * @param userId id del aspirante a consultar la información
   * @returns Un observable con la lista de las notificaciones
   */
  public getNotificationList({idUser}: { idUser: number}): Observable<Notificacion[]> {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/notificacion/listar?userId=${idUser}`,
      { headers: new HttpHeaders({ Authorization: '' }) }
    );
  }

  public checkNotifications() {
    return this.http.get( `${environment.apiBaseUrl}/notificacion/checkRead`, { headers: new HttpHeaders({ Authorization: '' })}  );
  }
}
