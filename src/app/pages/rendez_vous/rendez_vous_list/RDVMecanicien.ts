import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { RendezVousService } from '../../service/rendez-vous-service.service';
@Component({
    selector: 'app-list-historique-rdv-mecanicien',
    standalone: true,
    imports: [CommonModule, DataViewModule, TagModule],
    template: `
    <div class="flex flex-col">
        <div class="card">
            <div class="font-semibold text-xl mb-4">Historique des rendez-vous (Mécanicien)</div>
            <p-dataview [value]="historiqueRdv" [layout]="'list'">
                <ng-template #list let-items>
                    <div class="flex flex-col">
                        <div *ngFor="let item of historiqueRdv; let i = index">
                            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" [ngClass]="{ 'border-t border-surface': i !== 0 }">
                                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                    <div>
                                        <div class="text-lg font-medium">{{ item.client.nom }} {{ item.client.prenom }}</div>
                                        <div class="text-sm text-surface-500">{{ item.client.voiture_immatriculation }}</div>
                                        <div class="text-sm mt-2">Début : <span class="font-semibold">{{ item.date_heure_debut }}</span></div>
                                        <div class="text-sm">Fin : <span class="font-semibold">{{ item.date_heure_fin }}</span></div>
                                    </div>
                                    <div class="md:w-40 flex flex-col items-end gap-2">
                                        <p-tag [value]="item.statut"></p-tag>
                                        <span class="text-xl font-semibold">{{ item.price }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="md:w-40 flex flex-col items-end gap-2">
                                <p-tag [value]="item.statut"></p-tag>
                                <span class="text-xl font-semibold">{{ item.price }}</span>
                                <button class="p-button p-button-sm p-button-warning mt-2"
                                        (click)="changerEtatRdv(item)">
                                    Changer état
                                </button>
                                <button class="p-button p-button-sm p-button-info mt-2"
                                        (click)="allerVersTaches(item)">
                                    Voir tâches
                                </button>
                            </div>
                        </div>
                        <div *ngIf="historiqueRdv.length === 0" class="text-center text-gray-500 p-6">
                            Aucun rendez-vous historique trouvé.
                        </div>
                    </div>
                </ng-template>
            </p-dataview>
        </div>
    </div>
    `,
    styles: `
        ::ng-deep {
            .p-orderlist-list-container {
                width: 100%;
            }
        }
    `,
    providers: [RendezVousService]
})
export class RDVMecanicien implements OnInit {
    historiqueRdv: any[] = [];

    constructor(private rdvService: RendezVousService,private router: Router) { }

    ngOnInit() {
        this.rdvService.getRendezVousMecanicien().subscribe(
            (data) => {
                // Filtrer pour ne garder que les rendez-vous historiques (statut = 'Terminé' ou 'Historique')
                this.historiqueRdv = (data.rendezvous || []).filter((rdv: any) =>
                    rdv.statut && (rdv.statut.toLowerCase() === 'terminé' || rdv.statut.toLowerCase() === 'historique')
                );
            },
            (error: any) => {
                console.error('Erreur de récupération des rendez-vous', error);
            }
        );
    }
    changerEtatRdv(rdv: any) {
        // Appelle la fonction du service pour changer l'état
        this.rdvService.changerEtatRendezVous(rdv._id).subscribe({
            next: (res) => {
                // Met à jour localement ou recharge la liste
                rdv.etat = res.etat === 1 ? 'Terminé' : 'Non terminé';
            },
            error: (err) => {
                console.error('Erreur lors du changement d\'état', err);
            }
        });
    }

    allerVersTaches(rdv: any) {
        // Navigue vers la page des tâches du rendez-vous
        this.router.navigate(['/taches', rdv._id]);
    }
}