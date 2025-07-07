import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListParams } from './Params';

export interface HistoriqueServiceObject {
    nom_service: string;
    date: Date;
    status?: string;
}
@Injectable({
  providedIn: 'root'
})
export class HistoriqueService {
 private apiUrl = `${environment.apiUrl}/service/history`;

  constructor(private http: HttpClient) {}

  
  getHistoriqueByClient(params:ListParams): Observable<HistoriqueServiceObject[]> {
    return this.http.get<HistoriqueServiceObject[]>(`${this.apiUrl}?page=${params.page}&limit=${params.limit}&search=${params.search}&sortBy=${params.sortBy}&orderBy=${params.orderBy}`);
  }
  
}