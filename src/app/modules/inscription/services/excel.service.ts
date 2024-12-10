import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtService } from '../../auth/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: this._jwtService.getToken(),
    }),
    responseType: 'blob' as 'json'
  };

  private apiUrl = `${environment.apiBaseUrl}/report/user/excel`;

  constructor(private http: HttpClient, private _jwtService: JwtService) {}

  public downloadExcel(id: string): Observable<Blob> {
    return this.http.get<Blob>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  public downloadExcelAllAspirantes(): Observable<Blob> {
    return this.http.get<Blob>(`${this.apiUrl}/all`, this.httpOptions);
  }
}
