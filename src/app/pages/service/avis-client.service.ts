import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";

export interface AvisClient {
  _id?: string;
  score: number;
  date: string;
  client: { _id: string; nom?: string };
  avis: string;
  mecanicien?: { _id: string; nom?: string };
  statut: number;
  est_valide: boolean;
}

export interface AvisResponse {
  avis: AvisClient[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class AvisClientService {
  private apiUrl = `${environment.apiUrl}/avisclient`;

  constructor(private http: HttpClient) {}

  createAvis(avis: Partial<AvisClient>): Observable<any> {
    return this.http.post(this.apiUrl, avis);
  }

  getAvis(params: { page?: number; limit?: number; search?: string; sortBy?: string; orderBy?: string }): Observable<AvisResponse> {
    return this.http.get<AvisResponse>(this.apiUrl, { params });
  }

  validateAvis(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/validate/${id}`, {});
  }

  deleteAvis(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getValidatedAvisRandom(): Observable<any> {
    return this.http.get(`${this.apiUrl}/validated/random`);
  }
}