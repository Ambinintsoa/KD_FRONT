import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { UtilisateurObject, UtilisateurService, PaginatedResponse } from '../service/utilisateur.service';

@Component({
  selector: 'app-utilisateur-crud',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    InputNumberModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule
  ],
  template: `
    <p-toolbar styleClass="mb-6">
      <ng-template pTemplate="start">
        <p-button label="Ajouter" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
        <p-button severity="secondary" label="Supprimer" icon="pi pi-trash" outlined (onClick)="deleteSelectedUtilisateurs()" [disabled]="!selectedUtilisateurs || !selectedUtilisateurs.length" />
      </ng-template>
    </p-toolbar>

    <p-table
      #dt
      [value]="utilisateurs"
      [lazy]="true"
      (onLazyLoad)="loadUtilisateurs($event)"
      [rows]="rows"
      [totalRecords]="totalItems"
      [paginator]="true"
      [globalFilterFields]="['nom', 'prenom', 'email', 'role']"
      [tableStyle]="{ 'min-width': '75rem' }"
      [(selection)]="selectedUtilisateurs"
      [rowHover]="true"
      dataKey="_id"
      [showCurrentPageReport]="true"
      [rowsPerPageOptions]="[10, 20, 30]"
    >
      <ng-template pTemplate="caption">
        <div class="flex items-center justify-between">
          <h5 class="m-0">Gestion des Utilisateurs</h5>
          <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Recherche..." />
        </div>
      </ng-template>
      <ng-template pTemplate="header">
        <tr>
          <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
          <th pSortableColumn="nom">Nom <p-sortIcon field="nom" /></th>
          <th pSortableColumn="prenom">Prénom <p-sortIcon field="prenom" /></th>
          <th pSortableColumn="email">Email <p-sortIcon field="email" /></th>
          <th pSortableColumn="role">Rôle <p-sortIcon field="role" /></th>
          <th pSortableColumn="poste">Poste <p-sortIcon field="poste" /></th>
          <th pSortableColumn="genre">Genre <p-sortIcon field="genre" /></th>
          <th pSortableColumn="date_de_naissance">Date de naissance <p-sortIcon field="date_de_naissance" /></th>
          <th style="min-width: 12rem"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-utilisateur>
        <tr>
          <td style="width: 3rem"><p-tableCheckbox [value]="utilisateur" /></td>
          <td>{{ utilisateur.nom }}</td>
          <td>{{ utilisateur.prenom }}</td>
          <td>{{ utilisateur.email }}</td>
          <td>{{ utilisateur.role }}</td>
          <td>{{ utilisateur.poste }}</td>
          <td>{{ utilisateur.genre }}</td>
          <td>{{ utilisateur.date_de_naissance | date:'dd/MM/yyyy' }}</td>
          <td>
            <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editUtilisateur(utilisateur)" />
            <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteUtilisateur(utilisateur)" />
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog [(visible)]="utilisateurDialog" [style]="{ width: '450px' }" header="Détails Utilisateur" [modal]="true" styleClass="custom-dialog">
      <div class="form-container">
        <div class="form-group">
          <label for="nom" class="form-label">Nom</label>
          <input pInputText id="nom" [(ngModel)]="utilisateur.nom" required class="w-full p-2 rounded-md" (ngModelChange)="checkFormValidity()" />
          <small class="error-message" *ngIf="submitted && !utilisateur.nom">Nom requis</small>
        </div>
        <div class="form-group">
          <label for="prenom" class="form-label">Prénom</label>
          <input pInputText id="prenom" [(ngModel)]="utilisateur.prenom" class="w-full p-2 rounded-md" />
        </div>
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input pInputText id="email" [(ngModel)]="utilisateur.email" required class="w-full p-2 rounded-md" (ngModelChange)="checkFormValidity()" />
          <small class="error-message" *ngIf="submitted && !utilisateur.email">Email requis</small>
        </div>
        <div class="form-group">
          <label for="mot_de_passe" class="form-label">Mot de passe</label>
          <input pInputText type="password" id="mot_de_passe" [(ngModel)]="utilisateur.mot_de_passe" [required]="!utilisateur._id" class="w-full p-2 rounded-md" (ngModelChange)="checkFormValidity()" />
          <small class="error-message" *ngIf="submitted && !utilisateur._id && !utilisateur.mot_de_passe">Mot de passe requis</small>
        </div>
        <div class="form-group">
          <label for="role" class="form-label">Rôle</label>
          <p-dropdown 
            id="role" 
            [(ngModel)]="utilisateur.role" 
            [options]="roleOptions" 
            optionLabel="label" 
            optionValue="value" 
            placeholder="Sélectionner un rôle" 
            [required]="true" 
            class="w-full p-2 rounded-md" 
            (ngModelChange)="checkFormValidity()"
          />
          <small class="error-message" *ngIf="submitted && !utilisateur.role">Rôle requis</small>
        </div>
        <div class="form-group">
          <label for="genre" class="form-label">Genre</label>
          <p-dropdown 
            id="genre" 
            [(ngModel)]="utilisateur.genre" 
            [options]="genreOptions" 
            optionLabel="label" 
            optionValue="value" 
            placeholder="Sélectionner un genre" 
            [required]="true" 
            class="w-full p-2 rounded-md" 
            (ngModelChange)="checkFormValidity()"
          />
          <small class="error-message" *ngIf="submitted && !utilisateur.genre">Genre requis</small>
        </div>
        <div class="form-group">
          <label for="date_de_naissance" class="form-label">Date de naissance</label>
          <input pInputText type="date" id="date_de_naissance" [(ngModel)]="utilisateur.date_de_naissance" required class="w-full p-2 rounded-md" (ngModelChange)="checkFormValidity()" />
          <small class="error-message" *ngIf="submitted && !utilisateur.date_de_naissance">Date requise</small>
        </div>
        <div class="form-group">
          <label for="poste" class="form-label">Poste</label>
          <input pInputText id="poste" [(ngModel)]="utilisateur.poste" class="w-full p-2 rounded-md" />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Annuler" icon="pi pi-times" text (click)="hideDialog()" styleClass="p-button-secondary" />
        <p-button label="Sauvegarder" icon="pi pi-check" (click)="saveUtilisateur()" styleClass="p-button-primary" [disabled]="!isFormValid()" />
      </ng-template>
    </p-dialog>

    <p-confirmDialog [style]="{ width: '450px' }" />
  `,
  providers: [MessageService, ConfirmationService]
})
export class UtilisateurCrudComponent implements OnInit {
  utilisateurs: UtilisateurObject[] = [];
  utilisateur: UtilisateurObject = {} as UtilisateurObject;
  selectedUtilisateurs: UtilisateurObject[] = [];
  utilisateurDialog: boolean = false;
  submitted: boolean = false;
  rows: number = 10;
  totalItems: number = 0;

  // Options pour les dropdowns
  roleOptions = [
    { label: 'Manager', value: 'admin' },
    { label: 'Utilisateur', value: 'user' },
    { label: 'Mécanicien', value: 'mecanicien' }
  ];

  genreOptions = [
    { label: 'Homme', value: 'homme' },
    { label: 'Femme', value: 'femme' },
    { label: 'Autre', value: 'autre' }
  ];

  @ViewChild('dt') dt!: Table;

  constructor(
    private utilisateurService: UtilisateurService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadUtilisateurs({ first: 0, rows: this.rows });
  }

  loadUtilisateurs(event: any) {
    const page = (event.first / event.rows) + 1;
    const limit = event.rows;
    const search = event.globalFilter || '';
    const sortBy = event.sortField || 'nom';
    const orderBy = event.sortOrder === 1 ? 'asc' : 'desc';

    this.utilisateurService.getUtilisateurs(page, limit, search, sortBy, orderBy).subscribe({
      next: (response: PaginatedResponse) => {
        this.utilisateurs = response.utilisateurs;
        this.totalItems = response.totalItems;
        this.rows = limit;
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors du chargement' })
    });
  }

  openNew() {
    this.utilisateur = {} as UtilisateurObject;
    this.submitted = false;
    this.utilisateurDialog = true;
  }

  editUtilisateur(utilisateur: UtilisateurObject) {
    this.utilisateur = { ...utilisateur };
    this.utilisateurDialog = true;
    this.checkFormValidity(); // Vérifier la validité initiale lors de l'édition
  }

  deleteUtilisateur(utilisateur: UtilisateurObject) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer ${utilisateur.nom} ?`,
      header: 'Confirmer',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.utilisateurService.deleteUtilisateur(utilisateur._id!).subscribe({
          next: () => {
            this.utilisateurs = this.utilisateurs.filter(u => u._id !== utilisateur._id);
            this.totalItems--;
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur supprimé' });
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppression' })
        });
      }
    });
  }

  deleteSelectedUtilisateurs() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer les utilisateurs sélectionnés ?',
      header: 'Confirmer',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedUtilisateurs.forEach(u => {
          this.utilisateurService.deleteUtilisateur(u._id!).subscribe({
            next: () => {
              this.utilisateurs = this.utilisateurs.filter(val => val._id !== u._id);
              this.totalItems--;
            }
          });
        });
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateurs supprimés' });
        this.selectedUtilisateurs = [];
      }
    });
  }

  hideDialog() {
    this.utilisateurDialog = false;
    this.submitted = false;
  }

  // Vérifie la validité du formulaire en temps réel
  checkFormValidity() {
    if (this.utilisateur._id) {
      // Lors de la mise à jour, mot_de_passe n'est pas requis
      return !!this.utilisateur.nom &&
             !!this.utilisateur.email &&
             !!this.utilisateur.role &&
             !!this.utilisateur.genre &&
             !!this.utilisateur.date_de_naissance;
    } else {
      // Lors de la création, tous les champs requis doivent être remplis
      return !!this.utilisateur.nom &&
             !!this.utilisateur.email &&
             !!this.utilisateur.mot_de_passe &&
             !!this.utilisateur.role &&
             !!this.utilisateur.genre &&
             !!this.utilisateur.date_de_naissance;
    }
  }

  // Méthode pour déterminer si le formulaire est valide
  isFormValid(): boolean {
    return this.checkFormValidity();
  }

  saveUtilisateur() {
    this.submitted = true;
    if (!this.isFormValid()) return;

    if (this.utilisateur._id) {
      this.utilisateurService.updateUtilisateur(this.utilisateur._id, this.utilisateur).subscribe({
        next: (updated) => {
          const index = this.utilisateurs.findIndex(u => u._id === updated._id);
          this.utilisateurs[index] = updated;
          this.utilisateurs = [...this.utilisateurs];
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur mis à jour' });
          this.hideDialog();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la mise à jour' })
      });
    } else {
      this.utilisateurService.createUtilisateur(this.utilisateur).subscribe({
        next: (created) => {
          this.utilisateurs = [...this.utilisateurs, created];
          this.totalItems++;
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur créé' });
          this.hideDialog();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la création' })
      });
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}