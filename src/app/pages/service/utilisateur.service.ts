// src/app/services/utilisateur.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UtilisateurObject {
  _id?: string;
  nom: string;
  prenom?: string;
  email: string;
  mot_de_passe?: string;
  adresse?: string;
  contact?: string;
  role: string;
  poste?: string;
  genre: string;
  date_de_naissance: Date | string;
  salaire?: number;
  image?: string;
}
export interface PaginatedResponse {
    utilisateurs: UtilisateurObject[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  getUtilisateurs(page: number = 1, limit: number = 10, search: string = '', sortBy: string = 'nom', orderBy: string = 'asc'): Observable<PaginatedResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search)
      .set('sortBy', sortBy)
      .set('orderBy', orderBy);
    return this.http.get<PaginatedResponse>(this.apiUrl, { params });
  }

  getUtilisateur(id: string): Observable<UtilisateurObject> {
    return this.http.get<UtilisateurObject>(`${this.apiUrl}/${id}`);
  }

  createUtilisateur(utilisateur: UtilisateurObject): Observable<UtilisateurObject> {
    return this.http.post<UtilisateurObject>(this.apiUrl, utilisateur);
  }

  updateUtilisateur(id: string, utilisateur: UtilisateurObject): Observable<UtilisateurObject> {
    return this.http.put<UtilisateurObject>(`${this.apiUrl}/${id}`, utilisateur);
  }

  deleteUtilisateur(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}