// facture.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
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

import '../../../assets/facture/spinner.css';

interface Column {
  field: string;
  header: string;
}


@Component({
  selector: 'app-facture',
  standalone: true,
  styleUrls: ['../../../assets/facture/spinner.css'],
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
  <div *ngIf="isLoading" class="spinner-overlay">
    <div class="spinner"></div>
  </div>

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
        <div  id="facture-content">
              <!-- Invoice Basic Info -->
              <div class="grid grid-cols-2 gap-4">
                <div><strong>N° Facture:</strong> {{ selectedFacture?.numero_facture }}</div>
                <div><strong>Date:</strong> {{ selectedFacture?.date | date }}</div>
                <div><strong>Client:</strong> {{ selectedFacture?.client?.nom }}</div>
                <div><strong>Montant Total:</strong> {{ selectedFacture?.montant_total }}</div>
                <div><strong>Statut:</strong> {{ selectedFacture?.statut === 0 ? 'Non payé' : 'Confirmé' }}</div>
              </div>
            <hr>
              <!-- Invoice Details -->
              <div>
                <h3 class="font-bold mb-2 mt-2">Détails</h3>
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
          </div>
          <div> <p-button
                *ngIf="selectedFacture"
                label="Générer la facture en PDF"
                icon="pi pi-file-pdf"
                styleClass="p-button-success"
                (click)="generatePdf('facture-content',selectedFacture.numero_facture)"
              ></p-button>
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
                  <td><p-button   label="Recu" icon="pi pi-file-pdf" styleClass="p-button-success" (click)=genereRecu(paiement)></p-button></td>
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
        <div id="recu_paiement"></div>
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
  isLoading:boolean=false;

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

 //genere la facture en format pdf
generatePdf(id:string,numero:string='') {
  this.isLoading = true; // Afficher le spinner

  const element = document.getElementById(id);

  if (!element) {
    console.error('PDF content not found!');
    this.isLoading = false; // Cacher le spinner si erreur
    return;
  }

  html2canvas(element, {
    scale: 2, // Augmente la qualité (DPI)
    useCORS: true, // Gérer les images externes
    logging: true,
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190; // Ajuster la largeur pour le PDF
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

    // Télécharger le PDF
    pdf.save(`${id}_${numero}.pdf`);
  }).catch(error => {
    console.error('Error generating PDF:', error);
  }).finally(() => {
    this.isLoading = false; // Cacher le spinner
  });
}
//genere un recu pour un paiement
genereRecu(paiement: any) {
  if (!paiement) {
    console.error("Données de paiement ou facture manquantes.");
    return;
  }
 if (!this.selectedFacture?.client) {
  this.selectedFacture = { ...this.selectedFacture, client: { nom: 'Inconnu',email:'' } };
} else if (!this.selectedFacture.client.nom) {
  this.selectedFacture.client.nom = 'Inconnu';
}
  const date = new Date().toLocaleString(); //date de generation du recu

   const formattedDate = new Date(paiement.date_heure).toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
  let numero_recu=`REC_${this.selectedFacture?.numero_facture}_${Math.floor(Math.random() * 10).toString()}`; //TODO : don't forget to manage this
  const content = `
    <div
      style="
        font-family: Arial, sans-serif;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        max-width: 400px;
        margin: 0 auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background-color: #f9f9f9;
      "
    >
      <h1 style="text-align: center; color: #333;">Reçu de Paiement</h1>
      <hr style="margin: 20px 0;" />
      <p><strong>Date :</strong> ${formattedDate}</p>
      <p><strong>Numéro de Reçu :</strong> ${numero_recu}</p>
      <p><strong>Montant :</strong> ${paiement.montant_payer} Ar</p>
      <p><strong>Payé par :</strong> ${this.selectedFacture?.client?.nom ?? ''}</p>
      <hr style="margin: 20px 0;" />
      <p style="text-align: center; font-size: 14px; color: #555;">
        Merci pour votre paiement !
      </p>
      <p style="text-align: center; font-size: 9px; color: #555;">
        Généré le ${date}
      </p>
    </div>
  `;

  const recuElement = document.getElementById("recu_paiement");
  if (recuElement) {
    recuElement.innerHTML = content;
    this.generatePdf("recu_paiement",  Math.floor(Math.random() * 100000).toString());
    recuElement.style.visibility="hidden";

  } else {
    console.error("Élément avec l'ID 'recu_paiement' non trouvé.");
  }
}


}
