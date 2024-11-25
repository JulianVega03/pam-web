import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtService } from '../../auth/services/jwt.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocsService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwt.getToken(),
    }),
  };

  constructor(
    private http: HttpClient,
    private jwt: JwtService
  ) { }

  /**
   * Método para aceptar el documento por parde del admin
   */
  public acceptDoc({idDoc, idAspirant}: {idDoc: number, idAspirant: number}){
    return this.http.put(`${environment.apiBaseUrl}/doc/aprobar/${idDoc}/${idAspirant}`,null,this.httpOptions );
  }

  /**
   *
   * @param data
   * @returns
   */
  public rejectDoc(data: any) {
    return this.http.post(`${environment.apiBaseUrl}/doc/retroalimentacion`, data, this.httpOptions);
  }

  public downloadDocuments(id: number){
    return this.http.get(`${environment.apiBaseUrl}/documentos/downloadFolder?id=${id}`, { responseType: 'blob', headers: this.httpOptions.headers });
  }

  public listUserDocuments() {
    return this.http.get(`${environment.apiBaseUrl}/doc/listar`,{ headers: new HttpHeaders({Authorization:this.jwt.getToken()})});
  }

}
