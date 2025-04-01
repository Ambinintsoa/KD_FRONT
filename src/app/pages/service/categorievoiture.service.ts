import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';

export interface CategorieVoitureObject {
  _id: string;
  nom: string;
}
export interface CategorieVoitureResponse {
  categories: CategorieVoitureObject[],
  currentPage: number,
  totalItems: number,
  totalPages: number
}
@Injectable({
  providedIn: 'root'
})
export class CategorievoitureService {
  private apiUrl = `${environment.apiUrl}/categorievoiture`
  constructor(private http: HttpClient) { }
  
  getAllCategorieVoitures(): Observable<CategorieVoitureResponse> {
    return this.http.get<CategorieVoitureResponse>(`${this.apiUrl}/1`).pipe( // TODO :change the 1 to getAll
      tap(data => console.log("Données brutes reçues de l'API :", data)), // Vérification
      map(data => ({
        categories: data.categories.map((item:any) => ({
          _id: item._id,
          nom: item.nom,
        })),
        currentPage: data.currentPage,
        totalItems: data.totalItems,
        totalPages: data.totalPages,
      }))
    );
  }
}
