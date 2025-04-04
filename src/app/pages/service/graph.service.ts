// src/app/services/paiement.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class GraphService {
    private apiUrl = `${environment.apiUrl}/graph`; // Ajustez selon votre backend

    constructor(private http: HttpClient) { }

    getPaiementsParMois(): Observable<any> {
        return this.http.get(`${this.apiUrl}/paiement/mois`);
    }
    getStat(): Observable<any> {
        return this.http.get(`${this.apiUrl}/total`);
    }
    getAvis(): Observable<any> {
        return this.http.get(`${this.apiUrl}/score-distribution`);
    }
    getTop10(): Observable<any> {
        return this.http.get(`${this.apiUrl}/top-10-services`);
    }
    getExpesiveProduct(): Observable<any> {
        return this.http.get(`${this.apiUrl}/top-10-expensive-products`);
    }
}