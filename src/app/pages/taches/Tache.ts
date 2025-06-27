import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TacheService } from '../service/tache.service';

interface Tache {
    _id: string;
    service: {
        nom_service: string;
        duree: number;
        prix: number;
    };
    statut: string;
    rendez_vous: string;
}

@Component({
    selector: 'app-tache-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="card">
        <h2>Liste des tâches</h2>
        <table class="table-auto w-full">
            <thead>
                <tr>
                    <th>Service</th>
                    <th>Durée (h)</th>
                    <th>Prix (€)</th>
                    <th>Statut</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let tache of taches">
                    <td>{{ tache.service.nom_service }}</td>
                    <td>{{ tache.service.duree }}</td>
                    <td>{{ tache.service.prix }}</td>
                    <td>
                           <span [ngClass]="{
                                'text-yellow-600': tache.statut === 'A faire' || tache.statut === 0,
                                'text-green-600': tache.statut === 'Terminé' || tache.statut === 1
                            }">
                                {{ tache.statut === 0 ? 'A faire' : tache.statut === 1 ? 'Terminé' : tache.statut }}
                            </span>
                    </td>
                    <td>
                        <button class="p-button p-button-sm"
                            (click)="toggleStatut(tache, tache.statut === 0 ? 1 : 0)">
                            {{ tache.statut === 0 ? 'Activer' : 'Désactiver' }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    styles: `
        .p-button { padding: 4px 12px; border-radius: 4px; background: #007bff; color: #fff; border: none; cursor: pointer; }
        .p-button:hover { background: #0056b3; }
        .text-yellow-600 { color: #eab308; }
        .text-blue-600 { color: #2563eb; }
        .text-green-600 { color: #16a34a; }
    `
})
export class TacheComponent implements OnInit {
    taches: Tache[] = [];
    rendezVousId: string = '';

    constructor(
        private tacheService: TacheService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        // Récupère l'id du rendez-vous depuis l'URL
        this.rendezVousId = this.route.snapshot.paramMap.get('id') || '';
        if (this.rendezVousId) {
            this.tacheService.getTachesByRendezVous(this.rendezVousId).subscribe({
                next: (data) => {
                    this.taches = data.taches || [];
                },
                error: (err) => {
                    console.error('Erreur lors de la récupération des tâches', err);
                }
            });
        }
    }
    toggleStatut(tache: Tache, nouveauStatut: number) {
        this.tacheService.changerStatutTache(tache._id, nouveauStatut).subscribe({
            next: (res) => {
                 tache.statut = res.statut === 0 ? 'A faire' : 'Terminé';
            },
            error: (err) => {
                console.error('Erreur lors du changement de statut', err);
            }
        });
    }

  
}