import { Injectable } from '@angular/core';
import { JwtService } from '../../auth/services/jwt.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private http: HttpClient,
  ) {}


  public listUserDocuments(id: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/doc/listar?userId=${id}`,{ headers: new HttpHeaders({Authorization:''})});
  }
}
