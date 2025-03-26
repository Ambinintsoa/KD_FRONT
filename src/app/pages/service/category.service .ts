import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ListParams } from './Params';

export interface CategoryObject {
    _id?: string;
    nom_categorie?: string;
}
export interface CategoryResponse {
    categories:CategoryObject[],
    currentPage:number,
    totalItems:number,
    totalPages:number
}
@Injectable({providedIn: 'root'})
export class CategoryService {
    private apiUrl = `${environment.apiUrl}/categorie`
      constructor(private http: HttpClient) {}
    createCategory(categoryObject: CategoryObject): Observable<any> {
        return this.http.post(`${this.apiUrl}/save`, {"nom_categorie":categoryObject.nom_categorie});
    }
      
      getCategories(params:ListParams): Observable<CategoryResponse> {
        return this.http.get<CategoryResponse>(`${this.apiUrl}?page=${params.page}&limit=${params.limit}&search=${params.search}&sortBy=${params.sortBy}&orderBy=${params.orderBy}`).pipe(
            tap(data => console.log("Données brutes reçues de l'API :", data)), // Vérification
            map(data => ({
                categories: data.categories.map((item: any) => ({
                    _id: item._id,
                    nom_categorie: item.nom_categorie
                })),
                currentPage: data.currentPage,
                totalItems: data.totalItems,
                totalPages: data.totalPages
            }))
        );
    }
    getAllCategories(): Observable<CategoryResponse> {
        return this.http.get<CategoryResponse>(`${this.apiUrl}/getAll`).pipe(
            tap(data => console.log("Données brutes reçues de l'API :", data)), // Vérification
            map(data => ({
                categories: data.categories.map((item: any) => ({
                    _id: item._id,
                    nom_categorie: item.nom_categorie
                })),
                currentPage: data.currentPage,
                totalItems: data.totalItems,
                totalPages: data.totalPages
            }))
        );
    }
    updateCategorie(product: CategoryObject): Observable<any> {
        return this.http.put(`${this.apiUrl}/update`, product);
    }
    deleteCategorie(ids: string[]): Observable<any> {
        return this.http.delete(`${this.apiUrl}`, {
          body: ids
        });
      }
      
    
}
