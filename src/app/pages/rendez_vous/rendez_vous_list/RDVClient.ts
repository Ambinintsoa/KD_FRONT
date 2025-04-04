import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { OrderListModule } from 'primeng/orderlist';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { RendezVousService } from '../../service/rendez-vous-service.service';

import { DropdownModule } from 'primeng/dropdown';
@Component({
    selector: 'app-list-demo',
    standalone: true,
    imports:  [CommonModule, DataViewModule, DropdownModule,FormsModule, SelectButtonModule, OrderListModule, TagModule, ButtonModule, DialogModule],
    template: `<div class="flex flex-col">
    <div class="card">
        <div class="font-semibold text-xl">Liste des services</div>
        <p-dataview [value]="rdv_obj" [layout]="layout">
            <ng-template #header>
                <div class="flex justify-end">
                    <p-select-button [(ngModel)]="layout" [options]="options" [allowEmpty]="false">
                        <ng-template #item let-option>
                            <i class="pi " [ngClass]="{ 'pi-bars': option === 'list', 'pi-table': option === 'grid' }"></i>
                        </ng-template>
                    </p-select-button>
                </div>
            </ng-template>
            <ng-template #list let-items>
                <div class="flex flex-col">
                    <div *ngFor="let item of rdv_obj; let i = index">
                        <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" [ngClass]="{ 'border-t border-surface': i !== 0 }">
                            <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                    <div>
                                        <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.statut }}</span>
                                        <div class="text-lg font-medium mt-2">{{ item.client.nom }}{{ item.client.prenom }}</div>
                                        <div class="text-lg font-medium mt-2">{{ item.client.voiture_immatriculation}}</div>
                                    </div>
                                    <div class="bg-surface-100 p-1" style="border-radius: 30px">
                                        <div class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06);">
                                            <span class="text-surface-900 font-medium text-sm">{{ item.date_heure_debut }}</span>
                                            <i class="pi pi-star-fill text-yellow-500"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="md:w-40 relative">
                                    <div class="absolute bg-black/70 rounded-border" [style]="{ left: '4px', top: '4px' }">
                                        <p-tag [value]="item.statut"></p-tag>
                                    </div>
                                </div>
                                <div class="flex flex-col md:items-end gap-8">
                                    <span class="text-xl font-semibold"> {{ item.price }}</span>
                                    <div class="flex flex-row-reverse md:flex-row gap-2">
                                        <p-button icon="pi pi-eye" styleClass="h-full" [outlined]="true" [style]="{ marginRight: '6px' }" (click)="SeeDetails(item._id)"></p-button>
                                        <p-button icon="pi pi-check" styleClass="h-full p-button-info" [outlined]="true" [style]="{ marginRight: '6px' }" (click)="Assign(item.date_heure_debut, item._id)"></p-button>
                                        <p-button icon="pi pi-trash" styleClass="h-full p-button-danger" [outlined]="true" (click)="Remove(item._id)"></p-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ng-template>
        </p-dataview>
    </div>
</div>

<div 
  *ngIf="modalVisible" 
  class="fixed top-0 left-0 w-full h-full bg-black/50 z-40">
</div>
<div 
  *ngIf="confirm_modal" 
  class="fixed top-0 left-0 w-full h-full bg-black/50 z-40">
</div>

<!-- Modal de l'assignation -->
<div 
  *ngIf="modalVisible" 
  class="fixed z-50 top-1/2 left-1/2 bg-white rounded-xl shadow-xl" 
  [style]="{ 
    width: '650px', 
    padding: '30px', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'stretch', 
    gap: '20px', 
    transform: 'translate(-50%, -50%)' 
  }"
>
  <h2 class="text-xl font-semibold text-center">Assigner un mécanicien</h2>

  <!-- Champ Date -->
  <input 
    type="datetime-local" 
    [(ngModel)]="date_inserer" 
    class="p-inputtext p-component w-full" 
    [value]="default_date"
    placeholder="Choisir une date" 
  />

  <!-- Dropdown Mécanicien -->
  <p-dropdown 
    [options]="liste_mecanicien" 
    [(ngModel)]="id_mecanicien" 
    optionLabel="nom" 
    placeholder="Sélectionner un mécanicien"
    class="w-full"
  ></p-dropdown>

  <!-- Boutons -->
  <div class="flex justify-center gap-4 mt-4">
    <p-button label="Assigner" icon="pi pi-check" (click)="assignerRdv(date_inserer,id_mecanicien)"></p-button>
    <p-button label="Annuler" icon="pi pi-times" class="p-button-secondary" (click)="closeModal('modal_form')"></p-button>
  </div>
</div>

<!-- Modal de confirmation -->
<div 
  *ngIf="confirm_modal" 
  class="fixed z-50 top-1/2 left-1/2 bg-white rounded-xl shadow-xl" 
  [style]="{ 
    width: '650px', 
    padding: '30px', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'stretch', 
    gap: '20px', 
    transform: 'translate(-50%, -50%)' 
  }"
>
  <h2 class="text-xl font-semibold text-center">Confirmation</h2>

  <p>Vouler vous réellement supprimer ou annuler ce rendex-vous ? </p>

  <!-- Boutons -->
  <div class="flex justify-center gap-4 mt-4">
  <p-button label="Oui, supprimer" (click)="setReponseConfirmation(true)"></p-button>
  <p-button label="Annuler" class="p-button-secondary" (click)="setReponseConfirmation(false)"></p-button>
  
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
    providers: []
})
export class RDVClient implements OnInit {
    layout: 'list' | 'grid' = 'list';
    options = ['list', 'grid'];

    rdv_obj: any[] = [];
    liste_mecanicien: any[] = [];
    id_mecanicien:any=null;
    date_inserer: string = '';
    selectedMecanicien: any = null;
    modalVisible: boolean = false; // Contrôle l'affichage du modal
    selected_rdv:any=null;
    default_date:any=null;
    confirm_modal:boolean=false;
    reponse_modal:boolean=false;

    constructor(private rdvService: RendezVousService) {}

    ngOnInit() {
        this.rdvService.getRendezVousClient().subscribe(
            (data) => {
                this.rdv_obj = data.rendezvous;
            },
            (error:any) => {
                console.error('Erreur de récupération des rendez-vous', error);
            }
        );
    }

    SeeDetails(id_rdv: any) {
        alert(id_rdv);
        window.location.href = '/details_rdv?id=' + id_rdv;
    }

    Assign(date_heure_debut: string, id_rdv: any) {
        this.rdvService.getMecanicienDisponible(date_heure_debut).subscribe(
            (mecaniciens) => {
                this.liste_mecanicien = mecaniciens;
                console.log('Liste des mécaniciens disponibles:', this.liste_mecanicien);
            },
            (error:any) => {
                console.error('Erreur lors de la récupération des mécaniciens:', error);
            }
        );
        this.modalVisible = true; // Affiche le modal
        this.selected_rdv=id_rdv;
        this.default_date=date_heure_debut;
    }
    
    

    closeModal(modal_type:string) {
        if(modal_type==="modal_form"){
            this.modalVisible = false; // Ferme le modal
            this.selected_rdv=null;
            this.default_date=null;

        }else if(modal_type==="confirm_form"){
            this.confirm_modal=false;
            this.reponse_modal=false;
        }
        
    }

    assignerRdv(date_inserer: string, id_mecanicien: any) {
        // Appelle la fonction de service pour assigner le rendez-vous
        this.rdvService.assigner(date_inserer, this.selected_rdv, id_mecanicien).subscribe(
            (response) => {
                console.log('Rendez-vous assigné avec succès:', response);
                this.closeModal('modal_form'); // Ferme le modal après l'assignation
            },
            (error:any) => {
                console.error('Erreur lors de l\'assignation du rendez-vous:', error);
            }
        );
    }
    setModalConfirmation(){
        this.confirm_modal=true;
    }
    id_rdv_temporaire: any = null; // Pour garder en mémoire

Remove(id_rdv: any): void {
    this.id_rdv_temporaire = id_rdv;
    console.log(id_rdv,"heyyyyy");
    this.setModalConfirmation(); // Ouvre le modal
}

setReponseConfirmation(confirme: boolean) {
    if (confirme && this.id_rdv_temporaire) {
        console.log(confirme);

        this.rdvService.updateStatut(this.id_rdv_temporaire, 2);
        this.rdv_obj = this.rdv_obj.filter(item => item._id !== this.id_rdv_temporaire);
    }

    this.closeModal('confirm_form');
    this.id_rdv_temporaire = null; // Nettoyer
}

}
