// service/facture.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
export interface FactureObject {
  _id?: string;
  date?: Date;
  client?: { nom: string; email: string };
  rendez_vous?: any;
  montant_total?: number;
  statut?: number;
  numero_facture?: string;
  details?: DetailFacture[];
  paiements?: Paiement[];
}

export interface DetailFacture {
  _id?: string;
  prix: number;
  service?: any;
  produit?: any;
  quantite: number;
}

export interface Paiement {
  _id?: string;
  date_heure: Date;
  montant_payer: number;
}

export interface FactureResponse {
  factures: FactureObject[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface ListParams {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  orderBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class FactureService {
 private apiUrl = `${environment.apiUrl}/facture`;

  constructor(private http: HttpClient) {}

  getFactures(params: ListParams): Observable<FactureResponse> {
    return this.http.get<FactureResponse>(this.apiUrl, { params: params as any });
  }

  getFacturesByClient(params: ListParams): Observable<FactureResponse> {
    return this.http.get<FactureResponse>(`${this.apiUrl}/client`, { params: params as any });
  }
  
}