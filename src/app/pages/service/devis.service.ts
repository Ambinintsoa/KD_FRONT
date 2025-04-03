import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DevisObject {
  total_devis?: number;
  devis_details?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  private apiUrl = `${environment.apiUrl}/devis`;

  constructor(private http: HttpClient) { }

  getDevis(nouveau_devis: any): Observable<any> {
    const url = `${this.apiUrl}/`;
    console.log("Calling API with:", nouveau_devis, "URL:", url);
  
    return this.http.post<any>(url, { "nouveau_devis": nouveau_devis }).pipe(
      tap((data: any) => console.log("Données brutes reçues de l'API :", data)),
      map(data => ({ ...data })) // Transformation correcte
    );
  }
}
  
