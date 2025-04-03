import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProduitObject, ProduitResponse, ProduitService, ReassortRequest, StockEntryRecord } from '../service/produit.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ListParams } from '../service/Params';

interface Column {
  field: string;
  header: string;
}

interface StockEntry {
  produit: ProduitObject;
  quantity: number;
  prix: number;
}

@Component({
  selector: 'app-stock-management',
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
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule
  ],
  template: `
    <p-toolbar styleClass="mb-6">
      <ng-template #start>
        <p-button label="Demander Réassort" icon="pi pi-plus" severity="secondary" (onClick)="openReassortDialog()" [disabled]="!selectedProduits?.length" />
        <p-button label="Nouvelle Entrée de Stock" icon="pi pi-plus" severity="secondary" (onClick)="openStockEntryDialog()" [disabled]="!selectedProduits?.length" />
        <p-button label="Liste des Demandes" icon="pi pi-list" severity="secondary" (onClick)="openReassortListDialog()" class="ml-2" />
        <p-button label="Liste des Réassorts" icon="pi pi-list" severity="secondary" (onClick)="openStockEntryListDialog()" class="ml-2" />
      </ng-template>
    </p-toolbar>

    <p-table
      #dt
      [value]="produits"
      [columns]="cols"
      [lazy]="true"
      [paginator]="true"
      [totalRecords]="totalRecords"
      [globalFilterFields]="['nom_produit', 'unite']"
      [tableStyle]="{ 'min-width': '75rem' }"
      [(selection)]="selectedProduits"
      [rowHover]="true"
      dataKey="_id"
      [sortField]="sortBy"
      [sortOrder]="orderBy === 'asc' ? 1 : -1"
      [rows]="limit"
      [first]="first"
      currentPageReportTemplate=" {first} à {last} sur {totalRecords} produits "
      [showCurrentPageReport]="true"
      [rowsPerPageOptions]="[10, 20, 30]"
      (onLazyLoad)="onLazyLoad($event)"
      (onSort)="onSortChange($event)"
    >
      <ng-template #caption>
        <div class="flex items-center justify-between">
          <h5 class="m-0">Gestion du Stock</h5>
          <p-iconfield>
            <p-inputicon styleClass="pi pi-search" />
            <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Recherche..." />
          </p-iconfield>
        </div>
      </ng-template>
      <ng-template #header>
        <tr>
          <th style="width: 3rem">
            <p-tableHeaderCheckbox />
          </th>
          <th pSortableColumn="nom_produit" style="min-width:16rem">
            Produit
            <p-sortIcon field="nom_produit" />
          </th>
          <th pSortableColumn="unite" style="min-width:16rem">
            Unité
            <p-sortIcon field="unite" />
          </th>
          <th pSortableColumn="stock" style="min-width:16rem">
            Stock
            <p-sortIcon field="stock" />
          </th>
          <th pSortableColumn="demande" style="min-width:16rem">
            Demande
            <p-sortIcon field="demande" />
          </th>
          <th pSortableColumn="statut" style="min-width:16rem">
            Statut
            <p-sortIcon field="statut" />
          </th>
        </tr>
      </ng-template>
      <ng-template #body let-produit>
        <tr>
          <td style="width: 3rem">
            <p-tableCheckbox [value]="produit" />
          </td>
          <td style="min-width:16rem">{{ produit.nom_produit }}</td>
          <td style="min-width:16rem">{{ produit.unite }}</td>
          <td style="min-width:16rem">{{ produit.stock || 0 }}</td>
          <td style="min-width:16rem">{{ produit.demande || 0 }}</td>
          <td style="min-width:16rem">{{ produit.statut }}</td>
        </tr>
      </ng-template>
    </p-table>

    <!-- Dialogue pour demander un réassort -->
    <p-dialog [(visible)]="reassortDialog" [style]="{ width: '600px' }" header="Demande de Réassort" [modal]="true">
      <div class="flex flex-col gap-6">
        <div *ngFor="let entry of reassortEntries; let i = index">
          <label class="block font-bold mb-3">{{ entry.produit.nom_produit }}</label>
          <p-inputnumber [(ngModel)]="entry.quantity" [min]="1" placeholder="Quantité" class="w-full p-2  rounded-md"/>
        </div>
      </div>
      <ng-template #footer>
        <p-button label="Annuler" icon="pi pi-times" text (click)="hideReassortDialog()" />
        <p-button label="Envoyer" icon="pi pi-check" (click)="submitReassort()" [disabled]="!isReassortValid()" />
      </ng-template>
    </p-dialog>

    <!-- Dialogue pour entrée de stock -->
    <p-dialog [(visible)]="stockEntryDialog" [style]="{ width: '600px' }" header="Nouvelle Entrée de Stock" [modal]="true">
      <div class="flex flex-col gap-6">
        <div *ngFor="let entry of stockEntries; let i = index">
          <h6>{{ entry.produit.nom_produit }}</h6>
          <label class="block font-bold mb-3">Quantité</label>
          <p-inputnumber [(ngModel)]="entry.quantity" [min]="0" placeholder="Quantité"
          class="w-full p-2  rounded-md" />
          <label class="block font-bold mb-3">Prix</label>
          <p-inputnumber [(ngModel)]="entry.prix" [min]="0" placeholder="Prix" class="w-full p-2  rounded-md" />
        </div>
        <div>
          <label class="block font-bold mb-3">Facture (obligatoire)</label>
          <input type="file" (change)="onInvoiceSelected($event)" accept=".pdf, .jpg, .png" />
          <small class="text-red-500" *ngIf="submitted && !invoiceFile">La facture est requise.</small>
        </div>
      </div>
      <ng-template #footer>
        <p-button label="Annuler" icon="pi pi-times" text (click)="hideStockEntryDialog()" />
        <p-button label="Valider" icon="pi pi-check" (click)="submitStockEntry()" [disabled]="!isStockEntryValid()" />
      </ng-template>
    </p-dialog>

    <!-- Dialogue pour la liste des demandes de réassort -->
    <p-dialog [(visible)]="reassortListDialog" [style]="{ width: '800px' }" header="Liste des Demandes de Réassort" [modal]="true">
      <p-table [value]="reassortRequests" [paginator]="true" [rows]="10" [totalRecords]="reassortTotalRecords">
        <ng-template #header>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Date</th>
            <th>Utilisateur</th>
          </tr>
        </ng-template>
        <ng-template #body let-request>
          <tr>
            <td>{{ request.produitNom }}</td>
            <td>{{ request.quantity }}</td>
            <td>{{ request.date | date:'dd/MM/yyyy HH:mm' }}</td>
            <td>{{ request.user }}</td>
            <p-button 
            icon="pi pi-trash" 
            severity="danger" 
            (onClick)="deleteReassort(request)" 
            styleClass="p-button-sm" 
            label="Supprimer">
          </p-button>
          </tr>
        </ng-template>
      </p-table>
      <ng-template #footer>
        <p-button label="Fermer" icon="pi pi-times" text (click)="hideReassortListDialog()" />
      </ng-template>
    </p-dialog>

    <!-- Dialogue pour la liste des entrées de stock -->
    <p-dialog [(visible)]="stockEntryListDialog" [style]="{ width: '800px' }" header="Liste des Entrées de Stock" [modal]="true">
      <p-table [value]="stockEntriesList" [paginator]="true" [rows]="10" [totalRecords]="stockEntryTotalRecords">
        <ng-template #header>
          <tr>
            <th>Produit</th>
            <th>Prix Unitaire</th>
            <th>Quantité</th>
            <th>Date</th>
            <th>Utilisateur</th>
            <th>Facture</th>
          </tr>
        </ng-template>
        <ng-template #body let-entry>
          <tr>
            <td>{{ entry.produitNom }}</td>
            <td>{{ entry.prix_unitaire }}</td>
            <td>{{ entry.quantity }}</td>
            <td>{{ entry.date | date:'dd/MM/yyyy HH:mm' }}</td>
            <td>{{ entry.user }}</td>
            <td>
              <a *ngIf="entry.invoiceUrl" [href]="entry.invoiceUrl" target="_blank">Voir</a>
              <span *ngIf="!entry.invoiceUrl">-</span>
            </td>
            <td>
          <p-button 
            icon="pi pi-trash" 
            severity="danger" 
            (onClick)="deleteStockEntry(entry)" 
            styleClass="p-button-sm" 
            label="Supprimer">
          </p-button>
        </td>
          </tr>
        </ng-template>
      </p-table>
      <ng-template #footer>
        <p-button label="Fermer" icon="pi pi-times" text (click)="hideStockEntryListDialog()" />
      </ng-template>
    </p-dialog>

    <p-confirmdialog [style]="{ width: '450px' }" />
  `,
  providers: [MessageService, ProduitService, ConfirmationService]
})
export class StockManagement implements OnInit {
  produits: ProduitObject[] = [];
  totalRecords: number = 0;
  totalPages: number = 0;
  page: number = 1;
  limit: number = 10;
  first: number = 0;
  search: string = '';
  sortBy: string = 'nom_produit';
  orderBy: string = 'asc';

  reassortDialog: boolean = false;
  stockEntryDialog: boolean = false;
  reassortListDialog: boolean = false;
  stockEntryListDialog: boolean = false;
  selectedProduits: ProduitObject[] | null = [];
  reassortEntries: StockEntry[] = [];
  stockEntries: StockEntry[] = [];
  invoiceFile: File | null = null;
  submitted: boolean = false;

  reassortRequests: ReassortRequest[] = [];
  stockEntriesList: StockEntryRecord[] = [];
  reassortTotalRecords: number = 0;
  stockEntryTotalRecords: number = 0;

  cols: Column[] = [
    { field: 'nom_produit', header: 'Produit' },
    { field: 'unite', header: 'Unité' },
    { field: 'stock', header: 'Stock' },
    { field: 'demande', header: 'Demande' },
    { field: 'statut', header: 'Statut' }
  ];

  private loadDataSubject = new Subject<ListParams>();
  private loadReassortSubject = new Subject<ListParams>();
  private loadStockEntrySubject = new Subject<ListParams>();

  @ViewChild('dt') dt!: Table;

  constructor(
    private produitService: ProduitService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadDataSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((params) => this.loadProduits(params.page, params.limit, params.search, params.sortBy, params.orderBy));
    
    this.loadReassortSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((params) => this.loadReassortRequests(params));
    
    this.loadStockEntrySubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((params) => this.loadStockEntries(params));
  }

  ngOnInit() {
    this.loadProduits(this.page, this.limit, this.search, this.sortBy, this.orderBy);
  }

  loadProduits(page: number, limit: number, search: string, sortBy: string, orderBy: string) {
    this.produitService.getProduits({ page, limit, search, sortBy, orderBy }).subscribe({
      next: (data: ProduitResponse) => {
        this.produits = data.produits || [];
        console.log(data.produits)
        console.log(this.produits)
        this.totalRecords = data.totalItems || 0;
        this.totalPages = data.totalPages || 0;
        this.page = data.currentPage || 1;
        this.first = (this.page - 1) * this.limit;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec du chargement des produits', life: 3000 });
      }
    });
  }

  onLazyLoad(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.limit = event.rows;
    this.first = event.first;
    this.sortBy = event.sortField || this.sortBy;
    this.orderBy = event.sortOrder === 1 ? 'asc' : 'desc';
    this.triggerLoadData();
  }

  onSortChange(event: any) {
    this.sortBy = event.field;
    this.orderBy = event.order === 1 ? 'asc' : 'desc';
    this.triggerLoadData();
  }

  onGlobalFilter(dt: any, event: any) {
    this.search = event.target.value;
    this.page = 1;
    this.first = 0;
    this.triggerLoadData();
  }

  private triggerLoadData() {
    this.loadDataSubject.next({ page: this.page, limit: this.limit, search: this.search, sortBy: this.sortBy, orderBy: this.orderBy });
  }

  // Gestion du réassort
  openReassortDialog() {
    if (this.selectedProduits) {
      this.reassortEntries = this.selectedProduits.map(produit => ({ produit, quantity: 0 , prix:0}));
      this.submitted = false;
      this.reassortDialog = true;
    }
  }

  hideReassortDialog() {
    this.reassortDialog = false;
    this.reassortEntries = [];
  }

  isReassortValid(): boolean {
    return this.reassortEntries.every(entry => entry.quantity > 0);
  }

  submitReassort() {
    this.submitted = true;
    if (!this.isReassortValid()) return;

    const entries = this.reassortEntries.map(entry => ({
      produitId: entry.produit._id || '',
      quantity: entry.quantity
    }));
    this.produitService.requestReassort(entries).subscribe({
      next: () => {
        this.reassortEntries.forEach(entry => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Demande de réassort de ${entry.quantity} pour ${entry.produit.nom_produit} envoyée`,
            life: 3000
          });
        });
        this.triggerLoadData();
        this.hideReassortDialog();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de l\'envoi de la demande', life: 3000 });
      }
    });
  }

  // Gestion de l'entrée de stock
  openStockEntryDialog() {
    if (this.selectedProduits) {
      this.stockEntries = this.selectedProduits.map(produit => ({ produit, quantity: 0 , prix:0}));
      this.invoiceFile = null;
      this.submitted = false;
      this.stockEntryDialog = true;
    }
  }

  hideStockEntryDialog() {
    this.stockEntryDialog = false;
    this.stockEntries = [];
    this.invoiceFile = null;
  }

  onInvoiceSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.invoiceFile = input.files[0];
    }
  }

  isStockEntryValid(): boolean {
    return this.stockEntries.every(entry => entry.quantity >= 0) && !!this.invoiceFile;
  }

  submitStockEntry() {
    this.submitted = true;
    if (!this.isStockEntryValid()) return;

    const entries = this.stockEntries.map(entry => ({
      produitId: entry.produit._id || '',
      quantity: entry.quantity,
      prix: entry.prix,
    }));
    if (this.invoiceFile) {
      this.produitService.addStockEntry(entries, this.invoiceFile).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Entrée de stock enregistrée avec facture',
            life: 3000
          });
          this.triggerLoadData();
          this.hideStockEntryDialog();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de l\'enregistrement du stock', life: 3000 });
        }
      });
    }
  }

  // Liste des demandes de réassort
  openReassortListDialog() {
    this.reassortListDialog = true;
    this.loadReassortRequests({ page: 1, limit: 10, search: '', sortBy: 'date', orderBy: 'desc' });
  }

  hideReassortListDialog() {
    this.reassortListDialog = false;
    this.reassortRequests = [];
  }

  loadReassortRequests(params: ListParams) {
    this.produitService.getReassortRequests(params).subscribe({
      next: (data) => {
        this.reassortRequests = data.entries || [];
        this.reassortTotalRecords = data.totalItems || 0;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec du chargement des demandes', life: 3000 });
      }
    });
  }

  // Liste des entrées de stock
  openStockEntryListDialog() {
    this.stockEntryListDialog = true;
    this.loadStockEntries({ page: 1, limit: 10, search: '', sortBy: 'date', orderBy: 'desc' });
  }

  hideStockEntryListDialog() {
    this.stockEntryListDialog = false;
    this.stockEntriesList = [];
  }

  loadStockEntries(params: ListParams) {
    this.produitService.getStockEntries(params).subscribe({
      next: (data) => {
        this.stockEntriesList = data.entries || [];
        this.stockEntryTotalRecords = data.totalItems || 0;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec du chargement des entrées', life: 3000 });
      }
    });
  }

  deleteStockEntry(entry: StockEntryRecord) {
    this.confirmationService.confirm({
      message: `Voulez-vous vraiment supprimer l'entrée de stock pour ${entry.produitNom} (Quantité: ${entry.quantity}) ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.produitService.deleteStockEntry(entry._id!).subscribe({
          next: () => {
            this.stockEntriesList = this.stockEntriesList.filter(e => e._id !== entry._id);
            this.stockEntryTotalRecords--;
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Entrée de stock supprimée',
              life: 3000
            });
            this.cdr.detectChanges();
          },
          error: (err:any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Échec de la suppression de l’entrée',
              life: 3000
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Annulé',
          detail: 'Suppression annulée',
          life: 3000
        });
      }
    });
  }
  deleteReassort(entry: StockEntryRecord) {
    this.confirmationService.confirm({
      message: `Voulez-vous vraiment supprimer l'entrée de stock pour ${entry.produitNom} (Quantité: ${entry.quantity}) ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.produitService.deleteReassort(entry._id!).subscribe({
          next: () => {
            this.reassortRequests = this.reassortRequests.filter(e => e._id !== entry._id);
            this.reassortTotalRecords--;
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Demande supprimée',
              life: 3000
            });
            this.cdr.detectChanges();
          },
          error: (err:any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Échec de la suppression de l’entrée',
              life: 3000
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Annulé',
          detail: 'Suppression annulée',
          life: 3000
        });
      }
    });
  }
}