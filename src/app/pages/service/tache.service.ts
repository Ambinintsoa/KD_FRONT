import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TacheService {
    constructor(private http: HttpClient) { }

    getTachesByRendezVous(rdvId: string): Observable<any> {
        return this.http.get<any>(`/api/tache/search/1`);
    }

    changerStatutTache(tacheId: string, statut: number) {
       
        return this.http.put<any>(
            `/api/tache/update/${tacheId}/changer-statut`,
            { id: tacheId, statut: statut }
        );
    }
}