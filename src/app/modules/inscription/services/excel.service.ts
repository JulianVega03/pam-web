import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private apiUrl = `${environment.apiBaseUrl}/report/user/excel`;

  constructor(private http: HttpClient) {}

  downloadExcel(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }

  downloadExcelAllAspirantes(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/all`, { responseType: 'blob' });
  }
}
