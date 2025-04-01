import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface MarqueObject {
  _id: string;
  nom_marque: string;
}
export interface MarqueResponse {
  marques: MarqueObject[],
  currentPage: number,
  totalItems: number,
  totalPages: number
}
@Injectable({
  providedIn: 'root'
})
export class MarqueService {
  private apiUrl = `${environment.apiUrl}/marque`
  constructor(private http: HttpClient) { }

  getAllMarques(): Observable<MarqueResponse> {
    return this.http.get<MarqueResponse>(`${this.apiUrl}/1`).pipe(  // TODO :change the 1 to getAll
      tap((data) => console.log("Données brutes reçues de l'API :", data)), // Vérification
      map(data => ({
        marques: data.marques.map((item: any) => ({
          _id: item._id,
          nom_marque: item.nom_marque
        })),
        currentPage: data.currentPage,
        totalItems: data.totalItems,
        totalPages: data.totalPages
      }))
    );
  }
}
