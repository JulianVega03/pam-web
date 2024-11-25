import { Injectable } from '@angular/core';
import { JwtService } from '../../auth/services/jwt.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class S3Service {


  constructor(private http: HttpClient, private readonly jwt: JwtService) {}

  public uploadFile(tipoDocumento: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const url = `${environment.apiBaseUrl}/documentos/uploadFile/${tipoDocumento}`;
    return this.http.post<any>(url, formData, {headers: new HttpHeaders({Authorization:''})});
  }
}
