// facture.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { PaiementComponent } from '../paiement/paiementComponent.component';
import { FactureObject, FactureService, ListParams } from '../service/facture-list.service';
interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-facture',
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
    DialogModule,
    ConfirmDialogModule,
    PaiementComponent
  ],
  template: `

    <p-table
      #dt
      [value]="factureObjects"
      [columns]="cols"
      [lazy]="true"
      [paginator]="true"
      [totalRecords]="totalRecords"
      [globalFilterFields]="['numero_facture', 'client.nom']"
      [tableStyle]="{ 'min-width': '75rem' }"
      [(selection)]="selectedFactures"
      [rowHover]="true"
      dataKey="_id"
      [sortField]="sortBy"
      [sortOrder]="orderBy === 'asc' ? 1 : -1"
      [rows]="limit"
      [first]="first"
      currentPageReportTemplate=" {first} à {last} sur {totalRecords} factures"
      [showCurrentPageReport]="true"
      [rowsPerPageOptions]="[10, 20, 30]"
      (onLazyLoad)="onLazyLoad($event)"
      (onSort)="onSortChange($event)"
    >
      <ng-template #caption>
        <div class="flex items-center justify-between">
          <h5 class="m-0">Gestion des Factures</h5>
          <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Recherche..." />
        </div>
      </ng-template>
      <ng-template #header>
        <tr>
          <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
          <th pSortableColumn="numero_facture">N° Facture<p-sortIcon field="numero_facture" /></th>
          <th pSortableColumn="date">Date<p-sortIcon field="date" /></th>
          <th>Client</th>
          <th pSortableColumn="montant_total">Montant<p-sortIcon field="montant_total" /></th>
          <th pSortableColumn="statut">Statut<p-sortIcon field="statut" /></th>
          <th style="min-width: 14rem"></th>
        </tr>
      </ng-template>
      <ng-template #body let-facture>
        <tr>  
          <td><p-tableCheckbox [value]="facture" /></td>
          <td>{{ facture.numero_facture }}</td>
          <td>{{ facture.date | date }}</td>
          <td>{{ facture.client?.nom }}</td>
          <td>{{ facture.montant_total }}</td>
          <td>{{ facture.statut === 0 ? 'Non payé' : 'Confirmé' }}</td>
          <td>
            <p-button icon="pi pi-eye" class="mr-2" [rounded]="true" [outlined]="true" (click)="showDetails(facture)" />
          </td>
        </tr>
      </ng-template>
    </p-table>


    <!-- Details Dialog -->
    <p-dialog [(visible)]="detailsDialog" [style]="{ width: '800px' }" header="Détails de la Facture" [modal]="true">
      <ng-template #content>
        <div class="flex flex-col gap-6">
          <!-- Invoice Basic Info -->
          <div class="grid grid-cols-2 gap-4">
            <div><strong>N° Facture:</strong> {{ selectedFacture?.numero_facture }}</div>
            <div><strong>Date:</strong> {{ selectedFacture?.date | date }}</div>
            <div><strong>Client:</strong> {{ selectedFacture?.client?.nom }}</div>
            <div><strong>Montant Total:</strong> {{ selectedFacture?.montant_total }}</div>
            <div><strong>Statut:</strong> {{ selectedFacture?.statut === 0 ? 'Non payé' : 'Confirmé' }}</div>
          </div>

          <!-- Invoice Details -->
          <div>
            <h3 class="font-bold mb-2">Détails</h3>
            <p-table [value]="selectedFacture?.details ?? []" [tableStyle]="{ 'min-width': '50rem' }">
              <ng-template #header>
                <tr>
                  <th>Prix</th>
                  <th>Service</th>
                  <th>Produit</th>
                  <th>Quantité</th>
                </tr>
              </ng-template>
              <ng-template #body let-detail>
                <tr>
                  <td>{{ detail.prix }}</td>
                  <td>{{ detail.service?.nom || '-' }}</td>
                  <td>{{ detail.produit?.nom || '-' }}</td>
                  <td>{{ detail.quantite }}</td>
                </tr>
              </ng-template>
              <ng-template #emptymessage>
                <tr>
                  <td colspan="4">Aucun détail trouvé.</td>
                </tr>
              </ng-template>
            </p-table>
          </div>

          <!-- Payments -->
          <div>
            <h3 class="font-bold mb-2">Paiements</h3>
            <p-table [value]="selectedFacture?.paiements ?? []" [tableStyle]="{ 'min-width': '50rem' }">
              <ng-template #header>
                <tr>
                  <th>Date</th>
                  <th>Montant Payé</th>
                </tr>
              </ng-template>
              <ng-template #body let-paiement>
                <tr>
                  <td>{{ paiement.date_heure | date }}</td>
                  <td>{{ paiement.montant_payer }}</td>
                </tr>
              </ng-template>
              <ng-template #emptymessage>
                <tr>
                  <td colspan="2">Aucun paiement trouvé.</td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>
        <div
                style="
                  border: solid 1px #ccc;
                  margin: 20px;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  background-color: #f9f9f9;
                "
              *ngIf="checkStatut()">
                <button
                  style="
                    background-color:rgb(31, 185, 33);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                  "
                  (click)="payementForm = true" *ngIf="!payementForm"
                >
                  Entrer un paiement
                </button>
             
                <ng-container *ngIf="payementForm">
                  <paiementComponent (paiementForm_attr)="setPayementForm(true)"  [idfacture]="selectedFacture?._id || 'cc'" > </paiementComponent>
                </ng-container>
              </div>
      </ng-template>
      <ng-template #footer>
        <p-button label="Fermer" icon="pi pi-times" text (click)="detailsDialog = false" />
      </ng-template>
    </p-dialog>

    <p-confirmdialog [style]="{ width: '450px' }" />
  `,
  providers: [MessageService, FactureService, ConfirmationService]
})
export class FactureComponent implements OnInit {
  totalRecords: number = 0;
  page: number = 1;
  limit: number = 10;
  first: number = 0;
  search: string = "";
  sortBy: string = "date";
  orderBy: string = "desc";
  factureDialog: boolean = false;
  detailsDialog: boolean = false;
  private loadDataSubject = new Subject<ListParams>();
  factureObjects: FactureObject[] = [];
  factureObject!: FactureObject;
  selectedFacture: FactureObject | null = null;
  selectedFactures!: FactureObject[] | null;
  submitted: boolean = false;
  payementForm: boolean = false;
  cols!: Column[];

  @ViewChild('dt') dt!: Table;

  constructor(
    private factureService: FactureService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadDataSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(params => this.loadData(params));
  }

  ngOnInit() {
    this.cols = [
      { field: 'numero_facture', header: 'N° Facture' },
      { field: 'date', header: 'Date' },
      { field: 'client.nom', header: 'Client' },
      { field: 'montant_total', header: 'Montant' },
      { field: 'statut', header: 'Statut' }
    ];
    this.triggerLoadData();
  }

  loadData(params: ListParams) {
    this.factureService.getFactures(params).subscribe({
      next: (data) => {
        this.factureObjects = data.factures || [];
        this.totalRecords = data.totalItems || 0;
        this.page = data.currentPage || 1;
        this.first = (this.page - 1) * this.limit;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Échec du chargement des factures'
        });
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

  triggerLoadData() {
    this.loadDataSubject.next({
      page: this.page,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      orderBy: this.orderBy
    });
  }

  checkStatut() {
    if (this.selectedFacture?.statut === 0) {
      return true;  
    }
    return false;

  }

  showDetails(facture: FactureObject) {
    this.selectedFacture = facture;
    this.detailsDialog = true;
    console.log(this.selectedFacture?._id, "in the list");
  }

  hideDialog() {
    this.factureDialog = false;
    this.submitted = false;
  }

  setPayementForm(value: boolean) {
    this.payementForm = value;
  }

}