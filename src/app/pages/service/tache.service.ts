import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
interface Tache {
    _id: string;
    service: {
        nom_service: string;
        duree: number;
        prix: number;
    };
    statut: number;
    rendez_vous: string;
}
@Injectable({ providedIn: 'root' })
export class TacheService {
    constructor(private http: HttpClient) { }
    private apiUrl = `${environment.apiUrl}/tache`;

    getTachesByRendezVous(rdvId: string): Observable<Tache[]> {
        return this.http.get<{ taches: Tache[] }>(`${this.apiUrl}/search/${rdvId}`).pipe(
            tap(res => console.log('Tâches récupérées :', res)),
            map(res => res.taches), // 👈 extrait juste le tableau de tâches
            catchError((error) => {
                console.error('Erreur lors de la récupération des tâches :', error);
                return throwError(() => new Error('Échec de chargement des tâches'));
            })
        );
    }

    changerStatutTache(tacheId: string, statut: number) {

        return this.http.put<any>(
            `${this.apiUrl}/update/${tacheId}`,
            { id: tacheId, statut: statut }
        );
    }
}