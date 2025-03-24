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
import { CategoryObject, CategoryResponse, CategoryService } from "../service/category.service ";
import { ListParams } from "../service/Params";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Subject } from "rxjs";

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
  ],
  template: `
    <p-toolbar styleClass="mb-6">
      <ng-template #start>
        <p-button label="Ajouter" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
        <p-button severity="secondary" label="Supprimer" icon="pi pi-trash" outlined (onClick)="deleteSelectedProducts()" [disabled]="!selectedProducts || !selectedProducts.length" />
      </ng-template>
      <ng-template #end>
        <p-button label="Exporter" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
      </ng-template>
    </p-toolbar>

    <p-table
      #dt
      [value]="CategoryObjects"
      [columns]="cols"
      [lazy]="true"
      [paginator]="true"
      [totalRecords]="totalRecords"
      [globalFilterFields]="['nom_categorie']"
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
            <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Recherche..." />
          </p-iconfield>
        </div>
      </ng-template>
      <ng-template #header>
        <tr>
          <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
          <th pSortableColumn="nom_categorie" style="min-width:16rem">Catégorie <p-sortIcon field="nom_categorie" /></th>
          <th style="min-width: 12rem"></th>
        </tr>
      </ng-template>
      <ng-template #body let-product>
        <tr>
          <td style="width: 3rem"><p-tableCheckbox [value]="product" /></td>
          <td style="min-width: 16rem">{{ product.nom_categorie }}</td>
          <td>
            <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editProduct(product)" />
            <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteProduct(product)" />
          </td>
        </tr>
      </ng-template>
    </p-table>
    <p-dialog [(visible)]="productDialog" [style]="{ width: '450px' }" header="Product Details" [modal]="true">
      <ng-template #content>
        <div class="flex flex-col gap-6">
          <div>
            <label for="name" class="block font-bold mb-3">Nom de la catégorie</label>
            <input type="text" pInputText id="name" [(ngModel)]="CategoryObject.nom_categorie" required autofocus fluid />
            <small class="text-red-500" *ngIf="submitted && !CategoryObject.nom_categorie">Nom est requis.</small>
          </div>
        </div>
      </ng-template>
      <ng-template #footer>
        <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
        <p-button label="Save" icon="pi pi-check" (click)="saveProduct()" />
      </ng-template>
    </p-dialog>
    <p-confirmdialog [style]="{ width: '450px' }" />
  `,
  providers: [MessageService, CategoryService, ConfirmationService],
})
export class Category implements OnInit {
  totalRecords: number = 0;
  totalPages: number = 0;
  page: number = 1;
  limit: number = 10;
  first: number = 0;
  search: string = "";
  sortBy: string = "nom_categorie";
  orderBy: string = "asc";
  productDialog: boolean = false;
  CategoryObjects: CategoryObject[] = [];
  CategoryObject!: CategoryObject;
  selectedProducts!: CategoryObject[] | null;
  submitted: boolean = false;

  @ViewChild("dt") dt!: Table;

  exportColumns!: ExportColumn[];
  cols!: Column[];

  private loadDataSubject = new Subject<ListParams>();

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadDataSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((params) => {
        this.loadDemoData(params.page, params.limit, params.search, params.sortBy, params.orderBy);
      });
  }

  ngOnInit() {
    this.cols = [{ field: "nom_categorie", header: "Nom" }];
    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
    this.loadDemoData(this.page, this.limit, this.search, this.sortBy, this.orderBy); // Chargement initial direct
  }

  exportCSV() {
    this.dt.exportCSV();
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

  loadDemoData(page: number, limit: number, search: string, sortBy: string, orderBy: string) {
    this.categoryService.getCategories({ page, limit, search, sortBy, orderBy }).subscribe({
      next: (data: CategoryResponse) => {
        console.log("Réponse complète du backend :", data);
        this.CategoryObjects = data.categories || [];
        this.totalRecords = data.totalItems || 0;
        this.totalPages = data.totalPages || 0;
        this.page = data.currentPage || 1;
        this.first = (this.page - 1) * this.limit;
        this.cdr.detectChanges();
        console.log("CategoryObjects après mise à jour :", this.CategoryObjects);
        console.log("totalRecords après mise à jour :", this.totalRecords);
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
    this.CategoryObject = {};
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: CategoryObject) {
    this.CategoryObject = { ...product };
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: "Êtes-vous sûr de vouloir supprimer ces catégories ?",
      header: "Confirmer",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.CategoryObjects = this.CategoryObjects.filter(
          (val) => !this.selectedProducts?.includes(val)
        );
        this.selectedProducts = null;
        this.messageService.add({
          severity: "success",
          summary: "Succès",
          detail: "Catégories supprimées",
          life: 3000,
        });
        this.triggerLoadData();
      },
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteProduct(product: CategoryObject) {
    this.confirmationService.confirm({
      message: "Êtes-vous sûr de vouloir supprimer " + product.nom_categorie + " ?",
      header: "Confirmer",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.categoryService.deleteCategorie(product).subscribe({
          next: () => {
            this.CategoryObjects = this.CategoryObjects.filter((item) => item._id !== product._id);
            this.messageService.add({
              severity: "success",
              summary: "Succès",
              detail: "Catégorie supprimée",
              life: 3000,
            });
            this.triggerLoadData();
          },
          error: (err:Error) => {
            console.error("Erreur lors de la suppression :", err);
            this.messageService.add({
              severity: "error",
              summary: "Erreur",
              detail: "Échec de la suppression",
              life: 3000,
            });
          },
        });
        this.CategoryObject = {};
      },
    });
  }

  findIndexById(id: string): number {
    return this.CategoryObjects.findIndex((item) => item._id === id);
  }


  saveProduct() {
    this.submitted = true;
    if (!this.CategoryObject.nom_categorie?.trim()) return;

    if (this.CategoryObject._id) {
      this.categoryService.updateCategorie(this.CategoryObject).subscribe({
        next: () => {
          const index = this.findIndexById(this.CategoryObject._id ?? "");
          if (index !== -1) {
            this.CategoryObjects[index] = { ...this.CategoryObject };
          }
          this.messageService.add({
            severity: "success",
            summary: "Succès",
            detail: "Catégorie mise à jour",
            life: 3000,
          });
          this.productDialog = false;
          this.CategoryObject = {};
          this.triggerLoadData();
        },
        error: (err:Error) => {
          console.error("Erreur lors de la mise à jour :", err);
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: "Échec de la mise à jour",
            life: 3000,
          });
        },
      });
    } else {
      this.categoryService.createCategory(this.CategoryObject).subscribe({
        next: (newCategory: CategoryObject) => {
          this.CategoryObjects = [...this.CategoryObjects, newCategory];
          this.messageService.add({
            severity: "success",
            summary: "Succès",
            detail: "Catégorie créée",
            life: 3000,
          });
          this.productDialog = false;
          this.CategoryObject = {};
          this.triggerLoadData();
        },
        error: (err: Error) => {
          console.error("Erreur lors de la création :", err);
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: "Échec de la création",
            life: 3000,
          });
        },
      });
    }
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