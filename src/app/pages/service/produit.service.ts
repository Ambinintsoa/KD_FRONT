import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable, tap } from 'rxjs';
import { ListParams } from './Params';



export interface ProduitObject {
    _id?: string;
    nom_produit?: string;
    unite?: string;
    statut?:string;
}
export interface ProduitResponse {
    produits:ProduitObject[],
    currentPage:number,
    totalItems:number,
    totalPages:number
}
@Injectable()
export class ProduitService {
    private apiUrl = `${environment.apiUrl}/produit`
      constructor(private http: HttpClient) {}
    createProduit(produitObject: ProduitObject): Observable<any> {
        return this.http.post(`${this.apiUrl}/save`, {"nom_produit":produitObject.nom_produit,
            "unite":produitObject.unite
        });
    }
      
      getProduits(params:ListParams): Observable<ProduitResponse> {
        return this.http.get<ProduitResponse>(`${this.apiUrl}?page=${params.page}&limit=${params.limit}&search=${params.search}&sortBy=${params.sortBy}&orderBy=${params.orderBy}`).pipe(
            tap(data => console.log("Données brutes reçues de l'API :", data)), // Vérification
            map(data => ({
                produits: data.produits.map((item: any) => ({
                    _id: item._id,
                    nom_produit: item.nom_produit,
                    unite:item.unite,
                    statut: item.statut === 0 ? "Disponible" : "Non-Disponible"

                })),
                currentPage: data.currentPage,
                totalItems: data.totalItems,
                totalPages: data.totalPages
            }))
        );
    }

    updateProduit(product: ProduitObject): Observable<any> {
        return this.http.put(`${this.apiUrl}/update`, product);
    }
    deleteProduit(ids:string[]):Observable<any>{
        return this.http.delete(`${this.apiUrl}`, {
            body: ids
          });
    }
}
