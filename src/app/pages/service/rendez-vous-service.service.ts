import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {

  private apiUrl = `${environment.apiUrl}/rendezvous`;

  constructor(private http: HttpClient) { }


  sendRendezVousRequest(liste_tache:{service:string}[],date_rendez_vous:string,voiture:any) :Observable<any> {
    const url = `${this.apiUrl}/save`;
    const request_body={
      "date_heure_debut":date_rendez_vous+"T00:00:00",
      "taches":liste_tache,
      "voiture":voiture,
    }
  
    return this.http.post<any>(url, { "request_body":request_body }).pipe(
      tap((data: any) => console.log("Données brutes reçues de l'API :", data)),
      map(data => ({ ...data })) // Transformation correcte
    );
  }
  read() :Observable<any> {
    const url = `${this.apiUrl}/`;
    
  
    return this.http.get<any>(url).pipe(
      tap((data: any) => console.log("Données brutes reçues de l'API :", data)),
      map(data => ({ ...data })) // Transformation correcte
    );
  }
}
