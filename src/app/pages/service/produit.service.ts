import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListParams } from './Params';

export interface ProduitObject {
  _id?: string;
  nom_produit?: string;
  unite?: string;
  statut?: string;
  stock?:number;
  demande?:number;
}
export interface ProduitResponse {
  produits: ProduitObject[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
export interface ReassortRequest {
  _id?: string;
  produitId: string;
  produitNom: string;
  quantity: number;
  date: string;
  user: string;
}

export interface StockEntryRecord {
  _id?: string;
  produitId: string;
  produitNom: string;
  quantity: number;
  date: string;
  user: string;
  invoiceUrl?: string; // URL ou chemin de la facture
}
export interface Produit {
  _id?: string;
  nom_produit: string;
  prix: number;
  stock: number;
}

export interface UsageProduitService {
  _id?: string;
  service: string;
  produit: Produit;
  quantite: number;
}
@Injectable()
export class ProduitService {
  private apiUrl = `${environment.apiUrl}/produit`;
  constructor(private http: HttpClient) {}
  createProduit(produitObject: ProduitObject): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, {
      nom_produit: produitObject.nom_produit,
      unite: produitObject.unite,
    });
  }

  getProduits(params: ListParams): Observable<ProduitResponse> {
    return this.http
      .get<ProduitResponse>(
        `${this.apiUrl}?page=${params.page}&limit=${params.limit}&search=${params.search}&sortBy=${params.sortBy}&orderBy=${params.orderBy}`
      )
      .pipe(
        tap((data) => console.log("Données brutes reçues de l'API :", data)), // Vérification
        map((data) => ({
          produits: data.produits.map((item: any) => ({
            _id: item._id,
            nom_produit: item.nom_produit,
            unite: item.unite,
            stock: item.stock,
            demande: item.demande,
            statut: item.est_disponible === 0 ? "Disponible" : "Non-Disponible",
          })),
          currentPage: data.currentPage,
          totalItems: data.totalItems,
          totalPages: data.totalPages,
        }))
      );
  }

  updateProduit(product: ProduitObject): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, product);
  }
  deleteProduit(ids: string[]): Observable<any> {
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
  
    // Demande de réassort
    requestReassort(entries: { produitId: string, quantity: number }[]): Observable<any> {
      return this.http.post(`${this.apiUrl}/reassort`, { entries });
    }
  
    // Entrée de stock avec facture
    addStockEntry(entries: { produitId: string, quantity: number, prix:number }[], invoice: File): Observable<any> {
      const formData = new FormData();
      entries.forEach((entry, index) => {
        formData.append(`entries[${index}][produitId]`, entry.produitId);
        formData.append(`entries[${index}][quantity]`, entry.quantity.toString());
        formData.append(`entries[${index}][prix]`, entry.prix.toString());
      });
      formData.append('invoice', invoice);
      return this.http.post(`${this.apiUrl}/stock-entry`, formData);
    }
    
      // Récupérer la liste des demandes de réassort
  getReassortRequests(params: ListParams): Observable<{ entries: ReassortRequest[], totalItems: number }> {
    return this.http.get<{ entries: ReassortRequest[], totalItems: number }>(
      `${this.apiUrl}/reassort-requests?page=${params.page}&limit=${params.limit}&search=${params.search}&sortBy=${params.sortBy}&orderBy=${params.orderBy}`
    );
  }

  // Récupérer la liste des entrées de stock
  getStockEntries(params: ListParams): Observable<{ entries: StockEntryRecord[], totalItems: number }> {
    return this.http.get<{ entries: StockEntryRecord[], totalItems: number }>(
      `${this.apiUrl}/stock-entries?page=${params.page}&limit=${params.limit}&search=${params.search}&sortBy=${params.sortBy}&orderBy=${params.orderBy}`
    );
  }
  deleteStockEntry(entryId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/stock-entry/${entryId}`);
  }
  deleteReassort(entryId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reassort/${entryId}`);
  }
  getAllProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/all`);
}

getProduitsByService(serviceId: string): Observable<UsageProduitService[]> {
    return this.http.get<UsageProduitService[]>(`${this.apiUrl}/service/${serviceId}`);
}

addProduitToService(serviceId: string, produitId: string, quantite: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/service/${serviceId}`, { produitId, quantite });
}

removeProduitFromService(serviceId: string, produitId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/service/${serviceId}`, { 
        body: { produitId } 
    });
}
}
