import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table, TableModule } from "primeng/table";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { RatingModule } from "primeng/rating";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { SelectModule } from "primeng/select";
import { RadioButtonModule } from "primeng/radiobutton";
import { InputNumberModule } from "primeng/inputnumber";
import { DialogModule } from "primeng/dialog";
import { TagModule } from "primeng/tag";
import { InputIconModule } from "primeng/inputicon";
import { IconFieldModule } from "primeng/iconfield";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ListParams } from "../service/Params";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Subject } from "rxjs";
import { FileUploadModule } from "primeng/fileupload";
import { MarqueObject, MarqueResponse, MarqueService } from '../service/marque.service';

@Component({
  selector: "app-crud",
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
    ConfirmDialogModule,
    FileUploadModule,
  ],
  template: `
    <p-toolbar styleClass="mb-6">
      <ng-template #start>
      <p-fileupload
          #fu
          mode="basic"
          chooseLabel="Choisir"
          chooseIcon="pi pi-upload"
          accept=".xlsx, .xls"
          maxFileSize="1000000"
          (onSelect)="onFileSelected($event)"
           class="mr-2"
        />
        <p-button
          label="télécharger"
          (onClick)="uploadFile()"
          severity="secondary"
           class="mr-2"
        />
        <p>{{ message }}</p>
        <ul *ngIf="errorMessages.length > 0">
          <li *ngFor="let error of errorMessages" style="color: red;">
            {{ error }}
          </li>
        </ul>
        <p-button
          label="Ajouter"
          icon="pi pi-plus"
          severity="secondary"
          class="mr-2"
          (onClick)="openNew()"
        />
        <p-button
          severity="secondary"
          label="Supprimer"
          icon="pi pi-trash"
          outlined
          (onClick)="deleteSelectedProducts()"
          [disabled]="!selectedProducts || !selectedProducts.length"
        />
      </ng-template>
      <ng-template #end>
        <p-button
          label="Exporter"
          icon="pi pi-upload"
          severity="secondary"
          (onClick)="exportToExcel()"
        />
      </ng-template>
    </p-toolbar>

    <p-table
      #dt
      [value]="MarqueObjects"
      [columns]="cols"
      [lazy]="true"
      [paginator]="true"
      [totalRecords]="totalRecords"
      [globalFilterFields]="['nom_marque']"
      [tableStyle]="{ 'min-width': '75rem' }"
      [(selection)]="selectedProducts"
      [rowHover]="true"
      dataKey="_id"
      [sortField]="sortBy"
      [sortOrder]="orderBy === 'asc' ? 1 : -1"
      [rows]="limit"
      [first]="first"
      currentPageReportTemplate="{first} à {last} sur {totalRecords} catégories"
      [showCurrentPageReport]="true"
      [rowsPerPageOptions]="[10, 20, 30]"
      (onLazyLoad)="onLazyLoad($event)"
      (onSort)="onSortChange($event)"
    >
      <ng-template #caption>
        <div class="flex items-center justify-between">
          <h5 class="m-0">Gestion des Catégories</h5>
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
          <th pSortableColumn="nom_marque" style="min-width:16rem">
            Catégorie <p-sortIcon field="nom_marque" />
          </th>
          <th style="min-width: 12rem"></th>
        </tr>
      </ng-template>
      <ng-template #body let-product>
        <tr>
          <td style="width: 3rem"><p-tableCheckbox [value]="product" /></td>
          <td style="min-width: 16rem">{{ product.nom_marque }}</td>
          <td>
            <p-button
              icon="pi pi-pencil"
              class="mr-2"
              [rounded]="true"
              [outlined]="true"
              (click)="editProduct(product)"
            />
            <p-button
              icon="pi pi-trash"
              severity="danger"
              [rounded]="true"
              [outlined]="true"
              (click)="deleteProduct(product)"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
    <p-dialog
      [(visible)]="productDialog"
      [style]="{ width: '450px' }"
      header="Product Details"
      [modal]="true"
    >
      <ng-template #content>
        <div class="flex flex-col gap-6">
          <div>
            <label for="name" class="block font-bold mb-3"
              >Nom de la Marque</label
            >
            <input
              type="text"
              pInputText
              id="name"
              [(ngModel)]="MarqueObject.nom_marque"
              required
              autofocus
              fluid
            />
            <small
              class="text-red-500"
              *ngIf="submitted && !MarqueObject.nom_marque"
              >Nom est requis.</small
            >
            <small class="text-red-500" *ngIf="errors?.nom_marque">
              {{ errors.nom_marque }}
            </small>
          </div>
        </div>
      </ng-template>
      <ng-template #footer>
        <p-button
          label="Annuler"
          icon="pi pi-times"
          text
          (click)="hideDialog()"
        />
        <p-button
          label="Enregistrer"
          icon="pi pi-check"
          (click)="saveProduct()"
        />
      </ng-template>
    </p-dialog>
    <p-confirmdialog [style]="{ width: '450px' }" />
  `,
  providers: [MessageService, MarqueService, ConfirmationService],
})
export class Marque implements OnInit {
  errors: any = {};
  totalRecords: number = 0;
  totalPages: number = 0;
  page: number = 1;
  limit: number = 10;
  first: number = 0;
  search: string = "";
  sortBy: string = "nom_marque";
  orderBy: string = "asc";
  productDialog: boolean = false;
  MarqueObjects: MarqueObject[] = [];
  MarqueObject!: MarqueObject;
  selectedProducts!: MarqueObject[] | null;
  submitted: boolean = false;

  @ViewChild("dt") dt!: Table;

  exportColumns!: ExportColumn[];
  cols!: Column[];

  private loadDataSubject = new Subject<ListParams>();

  constructor(
    private marqueService: MarqueService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadDataSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((params) => {
        this.loadDemoData(
          params.page,
          params.limit,
          params.search,
          params.sortBy,
          params.orderBy
        );
      });
  }

  ngOnInit() {
    this.cols = [{ field: "nom_marque*", header: "Nom" }];
    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
    this.loadDemoData(
      this.page,
      this.limit,
      this.search,
      this.sortBy,
      this.orderBy
    ); // Chargement initial direct
  }

  onGlobalFilter(dt: any, event: any) {
    this.search = event.target.value;
    this.page = 1;
    this.first = 0;
    this.triggerLoadData();
  }

  onSortChange(event: any) {
    const field = event.field;
    const order = event.order === 1 ? "asc" : "desc";
    if (this.sortBy === field && this.orderBy === order) return;
    this.sortBy = field;
    this.orderBy = order;
    this.triggerLoadData();
  }

  onLazyLoad(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.limit = event.rows;
    this.first = event.first;
    this.sortBy = event.sortField || this.sortBy;
    this.orderBy = event.sortOrder === 1 ? "asc" : "desc";
    this.triggerLoadData();
  }

  private triggerLoadData() {
    this.loadDataSubject.next({
      page: this.page,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      orderBy: this.orderBy,
    });
  }

  loadDemoData(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    orderBy: string
  ) {
    this.marqueService
      .getMarques({ page, limit, search, sortBy, orderBy })
      .subscribe({
        next: (data: MarqueResponse) => {
          this.MarqueObjects = data.marques || [];
          this.totalRecords = data.totalItems || 0;
          this.totalPages = data.totalPages || 0;
          this.page = data.currentPage || 1;
          this.first = (this.page - 1) * this.limit;
          this.cdr.detectChanges();
        },
        error: (err: Error) => {
          console.error("Erreur lors du chargement :", err);
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: "Échec du chargement des données",
            life: 3000,
          });
        },
      });
  }

  openNew() {
    this.MarqueObject = {};
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: MarqueObject) {
    this.MarqueObject = { ...product };
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: "Êtes-vous sûr de vouloir supprimer ces marques ?",
      header: "Confirmer",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        const ids: string[] =
          this.selectedProducts
            ?.filter((cat) => !!cat._id)
            .map((cat) => String(cat._id)) ?? [];
        this.marqueService.deleteMarque(ids).subscribe({
          next: () => {
            this.MarqueObjects = this.MarqueObjects.filter(
              (val) => !this.selectedProducts?.includes(val)
            );
            this.messageService.add({
              severity: "success",
              summary: "Succès",
              detail: "Marque supprimée",
              life: 3000,
            });
            this.triggerLoadData();
          },
          error: (err: Error) => {
            console.error("Erreur lors de la suppression :", err);
            this.messageService.add({
              severity: "error",
              summary: "Erreur",
              detail: "Échec de la suppression",
              life: 3000,
            });
          },
        });
        this.MarqueObject = {};
      },
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.errors = {};
  }

  deleteProduct(product: MarqueObject) {
    this.confirmationService.confirm({
      message:
        "Êtes-vous sûr de vouloir supprimer " + product.nom_marque + " ?",
      header: "Confirmer",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.marqueService.deleteMarque([product._id || ""]).subscribe({
          next: () => {
            this.MarqueObjects = this.MarqueObjects.filter(
              (item) => item._id !== product._id
            );
            this.messageService.add({
              severity: "success",
              summary: "Succès",
              detail: "Catégorie supprimée",
              life: 3000,
            });
            this.triggerLoadData();
          },
          error: (err: Error) => {
            console.error("Erreur lors de la suppression :", err);
            this.messageService.add({
              severity: "error",
              summary: "Erreur",
              detail: "Échec de la suppression",
              life: 3000,
            });
          },
        });
        this.MarqueObject = {};
      },
    });
  }

  findIndexById(id: string): number {
    return this.MarqueObjects.findIndex((item) => item._id === id);
  }

  saveProduct() {
    this.submitted = true;
    if (!this.MarqueObject.nom_marque?.trim()) return;

    if (this.MarqueObject._id) {
      this.marqueService.updateMarque(this.MarqueObject).subscribe({
        next: () => {
          const index = this.findIndexById(this.MarqueObject._id ?? "");
          if (index !== -1) {
            this.MarqueObjects[index] = { ...this.MarqueObject };
          }
          this.messageService.add({
            severity: "success",
            summary: "Succès",
            detail: "Catégorie mise à jour",
            life: 3000,
          });
          this.productDialog = false;
          this.MarqueObject = {};
          this.triggerLoadData();
        },
        error: (err: any) => {
          if (err.error && err.error.field) {
            // Mappe l'erreur en fonction du champ renvoyé par le backend
            this.errors[err.error.field] = err.error.message;
          }
        },
      });
    } else {
      this.marqueService.createMarque(this.MarqueObject).subscribe({
        next: (newCategory: MarqueObject) => {
          this.MarqueObjects = [...this.MarqueObjects, newCategory];
          this.messageService.add({
            severity: "success",
            summary: "Succès",
            detail: "Catégorie créée",
            life: 3000,
          });
          this.productDialog = false;
          this.MarqueObject = {};
          this.triggerLoadData();
        },
        error: (err: any) => {
          if (err.error && err.error.field) {
            // Mappe l'erreur en fonction du champ renvoyé par le backend
            this.errors[err.error.field] = err.error.message;
          }
        },
      });
    }
  }

  //importation et exportation
  selectedFile: File | null = null;
  message: string = "";
  errorMessages: string[] = [];

  onFileSelected(event: any): void {
    if (event.files?.length) {
      this.selectedFile = event.files[0];
    }
  }

  uploadFile(): void {
    this.errorMessages = []; // Réinitialiser les erreurs
    this.message = ""; // Réinitialiser le message

    if (!this.selectedFile) {
      this.message = "Veuillez sélectionner un fichier";
      return;
    }

    this.marqueService.uploadFile(this.selectedFile).subscribe({
      next: (response: any) => {
        this.triggerLoadData() ;
        this.message = response.message;
      },
      error: (err) => {
        if (err.error.errors && Array.isArray(err.error.errors)) {
          this.errorMessages = err.error.errors; // Afficher toutes les erreurs
        } else {
          this.message = err.error.error || "Erreur lors de l'upload";
        }
      },
    });
  }

  exportToExcel(): void {
    this.message = ""; // Réinitialiser le message
    this.errorMessages = []; // Réinitialiser les erreurs

    this.marqueService.exportToExcel().subscribe({
      next: (blob: Blob) => {
        this.marqueService.downloadFile(blob, "catégories.xlsx");
        this.message = "Exportation réussie !";
      },
      error: (err: any) => {
        this.message = "Erreur lors de l'exportation : " + err.message;
      },
    });
  }
}

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}
