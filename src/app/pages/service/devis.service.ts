import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DevisResponse {
  // TODO: Define the properties of the response
}

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  private apiUrl = `${environment.apiUrl}/devis`;

  constructor(private http: HttpClient) { }

  getDevis(liste_service: any, voituredata: any): Observable<DevisResponse> {
    const url = `${this.apiUrl}/`;
    console.log("Calling API with:", liste_service, "URL:", url);

    return this.http.post<DevisResponse>(url, {
      liste_service: liste_service,
      voiture_data: voituredata
    }).pipe(
      tap((data: DevisResponse) => console.log("Données brutes reçues de l'API :", data))
      // Uncomment the following map if you need to transform the data
      // map(data => ({ ...data }))
    );
  }
}
