import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AvisClient, AvisClientService, AvisResponse } from '../service/avis-client.service';
import { ListParams } from '../service/Params';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-avis-client',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule
  ],
  template: `
    <p-toolbar styleClass="mb-6">
      <ng-template #start>
        <p-button
          severity="secondary"
          label="Supprimer"
          icon="pi pi-trash"
          outlined
          (onClick)="deleteSelectedAvis()"
          [disabled]="!selectedAvis || !selectedAvis.length"
        />
      </ng-template>
    </p-toolbar>

    <p-table
      #dt
      [value]="avisList"
      [lazy]="true"
      [paginator]="true"
      [totalRecords]="totalRecords"
      [globalFilterFields]="['avis', 'client.nom']"
      [tableStyle]="{ 'min-width': '75rem' }"
      [(selection)]="selectedAvis"
      [rowHover]="true"
      dataKey="_id"
      [sortField]="sortBy"
      [sortOrder]="orderBy === 'asc' ? 1 : -1"
      [rows]="limit"
      [first]="first"
      currentPageReportTemplate="{first} à {last} sur {totalRecords} avis"
      [showCurrentPageReport]="true"
      [rowsPerPageOptions]="[10, 20, 30]"
      (onLazyLoad)="onLazyLoad($event)"
      (onSort)="onSortChange($event)"
    >
      <ng-template #caption>
        <div class="flex items-center justify-between">
          <h5 class="m-0">Gestion des Avis Clients</h5>
          <p-iconfield>
            <p-inputicon styleClass="pi pi-search" />
            <input
              pInputText
              type="text"
              (input)="onGlobalFilter(dt, $event)"
              placeholder="Recherche..."
            />
          </p-iconfield>
        </div>
      </ng-template>
      <ng-template #header>
        <tr>
          <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
          <th pSortableColumn="score">Score <p-sortIcon field="score" /></th>
          <th pSortableColumn="avis">Avis <p-sortIcon field="avis" /></th>
          <th pSortableColumn="client.nom">Client <p-sortIcon field="client.nom" /></th>
          <th pSortableColumn="mecanicien.nom">Mécanicien <p-sortIcon field="mecanicien.nom" /></th>
          <th pSortableColumn="date">Date <p-sortIcon field="date" /></th>
          <th pSortableColumn="statut">Statut <p-sortIcon field="statut" /></th>
          <th pSortableColumn="est_valide">Validé <p-sortIcon field="est_valide" /></th>
          <th style="min-width: 12rem">Actions</th>
        </tr>
      </ng-template>
      <ng-template #body let-avis>
        <tr>
          <td style="width: 3rem"><p-tableCheckbox [value]="avis" /></td>
          <td>{{ avis.score }}</td>
          <td>{{ avis.avis }}</td>
          <td>{{ avis.client.nom || 'Inconnu' }}</td>
          <td>{{ avis.mecanicien?.nom || 'Non attribué' }}</td>
          <td>{{ avis.date | date:'dd/MM/yyyy HH:mm' }}</td>
          <td>
            <p-tag [severity]="avis.statut === 1 ? 'success' : 'warn'" [value]="avis.statut === 1 ? 'Publié' : 'Non publié'" />
          </td>
          <td>
            <p-tag [severity]="avis.est_valide ? 'success' : 'danger'" [value]="avis.est_valide ? 'Oui' : 'Non'" />
          </td>
          <td>
            <p-button
              icon="pi pi-check"
              class="mr-2"
              [rounded]="true"
              [outlined]="true"
              [disabled]="avis.est_valide"
              (click)="validateAvis(avis)"
              tooltip="Valider"
            />
            <p-button
              icon="pi pi-trash"
              severity="danger"
              [rounded]="true"
              [outlined]="true"
              (click)="deleteAvis(avis)"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-confirmdialog [style]="{ width: '450px' }" />
  `,
  providers: [MessageService, AvisClientService, ConfirmationService]
})
export class AvisClientComponent implements OnInit {
  avisList: AvisClient[] = [];
  selectedAvis: AvisClient[] | null = null;
  totalRecords = 0;
  page = 1;
  limit = 10;
  first = 0;
  search = '';
  sortBy = 'date';
  orderBy = 'desc';
  avisDialog = false;
  submitted = false;
  newAvis: Partial<AvisClient> = { score: 0, avis: '' };
  mecaniciens = [{ _id: 'mecanicien1', nom: 'Jean Dupont' }, { _id: 'mecanicien2', nom: 'Marie Curie' }]; // Exemple statique

  @ViewChild('dt') dt!: Table;

  private loadDataSubject = new Subject<ListParams>();

  constructor(
    private avisService: AvisClientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadDataSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(params => this.loadAvis(params));
  }

  ngOnInit() {
    this.loadAvis({ page: this.page, limit: this.limit, search: this.search, sortBy: this.sortBy, orderBy: this.orderBy });
  }

  loadAvis(params: ListParams) {
    this.avisService.getAvis(params).subscribe({
      next: (data: AvisResponse) => {
        this.avisList = data.avis;
        this.totalRecords = data.totalItems;
        this.page = data.currentPage;
        this.first = (this.page - 1) * this.limit;
        this.cdr.detectChanges();
      },
      error: (err:any) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec du chargement des avis', life: 3000 });
      }
    });
  }

  onGlobalFilter(dt: any, event: any) {
    this.search = event.target.value;
    this.page = 1;
    this.first = 0;
    this.triggerLoadData();
  }

  onSortChange(event: any) {
    this.sortBy = event.field;
    this.orderBy = event.order === 1 ? 'asc' : 'desc';
    this.triggerLoadData();
  }

  onLazyLoad(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.limit = event.rows;
    this.first = event.first;
    this.sortBy = event.sortField || this.sortBy;
    this.orderBy = event.sortOrder === 1 ? 'asc' : 'desc';
    this.triggerLoadData();
  }

  private triggerLoadData() {
    this.loadDataSubject.next({
      page: this.page,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      orderBy: this.orderBy
    });
  }


  validateAvis(avis: AvisClient) {
    this.confirmationService.confirm({
      message: `Valider et publier l’avis de ${avis.client.nom || 'ce client'} ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.avisService.validateAvis(avis._id!).subscribe({
          next: () => {
            avis.est_valide = true;
            avis.statut = 1;
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Avis validé', life: 3000 });
            this.cdr.detectChanges();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la validation', life: 3000 });
          }
        });
      }
    });
  }

  deleteAvis(avis: AvisClient) {
    this.confirmationService.confirm({
      message: `Supprimer l’avis de ${avis.client.nom || 'ce client'} ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.avisService.deleteAvis(avis._id!).subscribe({
          next: () => {
            this.avisList = this.avisList.filter(a => a._id !== avis._id);
            this.totalRecords--;
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Avis supprimé', life: 3000 });
            this.cdr.detectChanges();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression', life: 3000 });
          }
        });
      }
    });
  }

  deleteSelectedAvis() {
    this.confirmationService.confirm({
      message: 'Supprimer les avis sélectionnés ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedAvis!.map(a => a._id!);
        ids.forEach(id => {
          this.avisService.deleteAvis(id).subscribe({
            next: () => {
              this.avisList = this.avisList.filter(a => !ids.includes(a._id!));
              this.totalRecords -= ids.length;
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Avis supprimés', life: 3000 });
              this.cdr.detectChanges();
            },
            error: () => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression', life: 3000 });
            }
          });
        });
        this.selectedAvis = null;
      }
    });
  }
}