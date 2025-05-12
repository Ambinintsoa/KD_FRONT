import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaiementObject {
    montant?: number;
    date?: Date;
    idClient?: string;
}
@Injectable({
    providedIn: 'root'
})
export class PaiementService {
    private apiUrl = `${environment.apiUrl}/paiement`;
    constructor(private http: HttpClient) { }

    savePaiement(data: any): Observable<any> {
        const url = `${this.apiUrl}/save`;

        return this.http.post<any>(url, { data }).pipe(
            tap((data: any) => console.log("Données brutes reçues de l'API :", data)),
            map(data => ({ ...data }))
        );
    }

}