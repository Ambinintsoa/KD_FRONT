
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListParams } from './Params';


export interface MarqueObject {
  _id?: string;
  nom_marque?: string;
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
    createMarque(marqueObject: MarqueObject): Observable<any> {
      return this.http.post(`${this.apiUrl}/save`, {
        nom_marque: marqueObject.nom_marque,
      });
    }
  
    getMarques(params: ListParams): Observable<MarqueResponse> {
      return this.http
        .get<MarqueResponse>(
          `${this.apiUrl}?page=${params.page}&limit=${params.limit}&search=${params.search}&sortBy=${params.sortBy}&orderBy=${params.orderBy}`
        )
        .pipe(
          tap((data) => console.log("Données brutes reçues de l'API :", data)), // Vérification
          map((data) => ({
            marques: data.marques.map((item: any) => ({
              _id: item._id,
              nom_marque: item.nom_marque,
            })),
            currentPage: data.currentPage,
            totalItems: data.totalItems,
            totalPages: data.totalPages,
          }))
        );
    }
    getAllMarquesPaginated(): Observable<MarqueResponse> {
      return this.http.get<MarqueResponse>(`${this.apiUrl}/getAll`).pipe(
        tap((data) => console.log("Données brutes reçues de l'API :", data)), // Vérification
        map((data) => ({
          marques: data.marques.map((item: any) => ({
            _id: item._id,
            nom_marque: item.nom_marque,
          })),
          currentPage: data.currentPage,
          totalItems: data.totalItems,
          totalPages: data.totalPages,
        }))
      );
    }
    updateMarque(product: MarqueObject): Observable<any> {
      return this.http.put(`${this.apiUrl}/update`, product);
    }
    deleteMarque(ids: string[]): Observable<any> {
      return this.http.delete(`${this.apiUrl}`, {
        body: ids,
      });
    }
    uploadFile(selectedFile: File): Observable<any> {
      if (!selectedFile) {
        throw new Error("Veuillez sélectionner un fichier");
      }
  
      const formData = new FormData();
      formData.append("file", selectedFile);
  
      return this.http.post(`${this.apiUrl}/import`, formData);
    }
  
    exportToExcel(): Observable<Blob> {
      return this.http.get(`${this.apiUrl}/export`, { responseType: "blob" });
    }
  
    // Méthode utilitaire pour télécharger le fichier
    downloadFile(blob: Blob, fileName: string): void {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    }
}
