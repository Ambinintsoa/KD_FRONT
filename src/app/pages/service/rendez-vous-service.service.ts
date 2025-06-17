import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service'; // Assurez-vous d'avoir ce service d'authentification

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {

  private apiUrl = `${environment.apiUrl}/rendezvous`;

  constructor(private http: HttpClient, private auth_service: AuthService) { }


  sendRendezVousRequest(liste_tache: { service: string }[], date_rendez_vous: string, voiture: any, devis_object: any): Observable<any> {
    const url = `${this.apiUrl}/save`;
    // console.log(date_rendez_vous, "mandalo ve");

    const request_body = {
      "date_heure_debut": date_rendez_vous + "T00:00:00",
      "taches": liste_tache,
      "voiture": voiture,
      "devis_object": devis_object
    }

    return this.http.post<any>(url, { "request_body": request_body }).pipe(
      tap((data: any) => console.log("Données brutes reçues de l'API :", data)),
      map(data => ({ ...data })) // Transformation correcte
    );
  }

  getRendezVousAll(): Observable<any> {
    const url = `${this.apiUrl}/`;

    return this.http.get<any>(url).pipe(
      tap((data: any) => console.log("Données brutes reçues de l'API :", data)),
      map(data => ({ ...data })) // Transformation correcte
    );
  }
  getRendezVousNonAssigné(): Observable<any> {
    const url = `${this.apiUrl}/search/1`;
    return this.http.post<any>(url, { statut: "Non Assigné" }).pipe(
      tap((data: any) => console.log("Données brutes reçues de l'API :", data)),
      map(data => ({ ...data })) // Transformation correcte
    );
  }

  getRendezVousClient(): Observable<any> {
    const url = `${this.apiUrl}/search/1`;
    return this.http.post<any>(url, { client: this.auth_service.getCurrentUser()()?.userId }).pipe(
      tap((data: any) => console.log("Données brutes reçues de l'API :", data)),
      map(data => ({ ...data })) // Transformation correcte
    );
  }
  getRendezVousMecanicien(): Observable<any> {
    const url = `${this.apiUrl}/mecanicien_rdv/1`;
    let date_filtre = new Date().toString() + "T00:00:00";
    // const params = new HttpParams().set('date_debut', date_filtre.toString()); // Use toISOString if you're sending a date.

    return this.http.post<any>(url, { mecanicien: this.auth_service.getCurrentUser()()?.userId, date: date_filtre }).pipe(
      tap((data: any) => console.log("Données brutes reçues de l'API :", data)),
      map(data => ({ ...data })) // Transformation correcte
    );
  }

  //rends le statut = 
  // 0=> Non Assigné, 1=>Assigné 
  // 2 => annuler; 3 terminé; 
  updateStatut(id_rdv: string, statut: number) {
    const url = `${this.apiUrl}/update`;
    let etat = "Non assigné";
    if (statut === 0) {
      etat = "Non Assigné";
    } else if (statut === 1) {
      etat = "Assigné";
    } else if (statut === 2) {
      etat = "Annulé";
    }
    else if (statut === 3) {
      etat = "Terminé";
    }

    const body = { _id: id_rdv, statut: etat };
    // console.log("helloooo");
    this.http.put(url, body).subscribe(response => {
      console.log('Modification avec succes:', response);
    });
  }

  getMecanicienDisponible(date_debut: string): Observable<any[]> {
    const url = `${this.apiUrl}/mecanicien/1`;
    console.log(url,"huhuuu");
    return this.http.post<any>(url, { date_debut: date_debut }).pipe(
      tap((data: any) => console.log("Données brutes reçues de l'API :", data)),
      map((data: any) => data.mecaniciens || [])
    );
  }
  assigner(date_inserer: string, rdv: any, mecanicien: any): Observable<any> {
    const url = `${this.apiUrl}/assign`;
    const body = { date_inserer, rdv, mecanicien:mecanicien._id }; //TODO Check s'il y a date => changemant de date inital => nouveau date
    return this.http.post<any>(url, body);
  }



}
