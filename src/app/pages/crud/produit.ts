import { ChangeDetectorRef, Component, OnInit, signal, ViewChild } from '@angular/core';
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
import { ProduitObject,ProduitResponse,ProduitService } from '../service/produit.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ListParams } from '../service/Params';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-crud',
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
                <p-button label="Ajouter" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Supprimer" icon="pi pi-trash" outlined (onClick)="deleteSelectedProducts()" [disabled]="!selectedProducts || !selectedProducts.length" />
            </ng-template>

            <ng-template #end>
                <p-button label="Exporter" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="ProduitObjects"
            [columns]="cols"
            [lazy]="true"
      [paginator]="true"
      [totalRecords]="totalRecords"
            [globalFilterFields]="['nom_produit', 'unité']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedProducts"
            [rowHover]="true"
            dataKey="_id"
      [sortField]="sortBy"
      [sortOrder]="orderBy === 'asc' ? 1 : -1"
      [rows]="limit"
      [first]="first"
            currentPageReportTemplate=" {first} à {last} sur {totalRecords} produits    "
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
                (onLazyLoad)="onLazyLoad($event)"
      (onSort)="onSortChange($event)"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Gestion des Produits</h5>
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
                    <th pSortableColumn="statut" style="min-width:16rem">
                        Disponibilité
                        <p-sortIcon field="statut" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-product>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="product" />
                    </td>
                    <td style="min-width: 16rem">{{ product.nom_produit }}</td>
                    <td style="min-width: 16rem">{{ product.unite }}</td>
                    <td style="min-width: 16rem">{{ product.statut }}</td>
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
                        <label for="name" class="block font-bold mb-3">Nom du produit</label>
                        <input type="text" pInputText id="name" [(ngModel)]="ProduitObject.nom_produit" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !ProduitObject.nom_produit">Nom est requis.</small>
                        <small class="text-red-500" *ngIf="errors?.nom_produit">
    {{ errors.nom_produit }}
  </small>
                    </div>
                    <div>
                        <span class="block font-bold mb-4">Unité</span>
                        <div class="grid grid-cols-12 gap-4">
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category1" name="category" value="litre" [(ngModel)]="ProduitObject.unite" />
                                <label for="category1">Litre</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category2" name="category" value="metre" [(ngModel)]="ProduitObject.unite" />
                                <label for="category2">Mètre</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category3" name="category" value="gramme" [(ngModel)]="ProduitObject.unite" />
                                <label for="category3">gramme</label>
                            </div>
                        </div>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Annuler" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Enregistrer" icon="pi pi-check" (click)="saveProduct()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ProduitService, ConfirmationService]
})
export class Produit implements OnInit {
  errors:any= {};
    totalRecords: number = 0;
    totalPages: number = 0;
    page: number = 1;
    limit: number = 10;
    first: number = 0;
    search: string = "";
    sortBy: string = "nom_produit";
    orderBy: string = "asc";
    productDialog: boolean = false;
private loadDataSubject = new Subject<ListParams>();
    ProduitObjects:ProduitObject[]= [];

    ProduitObject!: ProduitObject;

    selectedProducts!: ProduitObject[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private ProduitService: ProduitService,
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

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.cols = [{ field: "nom_produit", header: "Nom" }];
        this.exportColumns = this.cols.map((col) => ({
          title: col.header,
          dataKey: col.field,
        }));
        this.loadDemoData(this.page, this.limit, this.search, this.sortBy, this.orderBy); // Chargement initial direct
      }

  loadDemoData(page: number, limit: number, search: string, sortBy: string, orderBy: string) {
    this.ProduitService.getProduits({ page, limit, search, sortBy, orderBy }).subscribe({
      next: (data: ProduitResponse) => {
        console.log("Réponse complète du backend :", data);
        this.ProduitObjects = data.produits || [];
        this.totalRecords = data.totalItems || 0;
        this.totalPages = data.totalPages || 0;
        this.page = data.currentPage || 1;
        this.first = (this.page - 1) * this.limit;
        this.cdr.detectChanges();
        console.log("Produit après mise à jour :", this.ProduitObjects);
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
  onLazyLoad(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.limit = event.rows;
    this.first = event.first;
    this.sortBy = event.sortField || this.sortBy;
    this.orderBy = event.sortOrder === 1 ? "asc" : "desc";
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
  onGlobalFilter(dt: any, event: any) {
    this.search = event.target.value;
    this.page = 1;
    this.first = 0;
    this.triggerLoadData();
  }

    openNew() {
        this.ProduitObject = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: ProduitObject) {
        this.ProduitObject = { ...product };
        this.productDialog = true;
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
    

      deleteSelectedProducts() {
        this.confirmationService.confirm({
          message: "Êtes-vous sûr de vouloir supprimer ces catégories ?",
          header: "Confirmer",
          icon: "pi pi-exclamation-triangle",
          accept: () => {
            const ids: string[] = this.selectedProducts
            ?.filter(cat => !!cat._id)
            .map(cat => String(cat._id)) ?? [];
            this.ProduitService.deleteProduit(ids).subscribe({
              next: () => {
                this.ProduitObjects = this.ProduitObjects.filter(
                  (val) => !this.selectedProducts?.includes(val)
                );
                this.messageService.add({
                  severity: "success",
                  summary: "Succès",
                  detail: "Produit supprimé",
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
            this.ProduitObject = {};
          },
        });
      }
    

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product: ProduitObject) {
        this.confirmationService.confirm({
            message: "Êtes-vous sûr de vouloir supprimer " + product.nom_produit + " ?",
            header: "Confirmer",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
              this.ProduitService.deleteProduit([product._id||'']).subscribe({
                next: () => {
                  this.ProduitObjects = this.ProduitObjects.filter((item) => item._id !== product._id);
                  this.messageService.add({
                    severity: "success",
                    summary: "Succès",
                    detail: "Produit supprimée",
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
              this.ProduitObject = {};
            },
          });
        }

        findIndexById(id: string): number {
            return this.ProduitObjects.findIndex((item) => item._id === id);
          }


  saveProduct() {
    this.submitted = true;
    if (!this.ProduitObject.nom_produit?.trim()) return;

    if (this.ProduitObject._id) {
      this.ProduitService.updateProduit(this.ProduitObject).subscribe({
        next: () => {
          const index = this.findIndexById(this.ProduitObject._id ?? "");
          if (index !== -1) {
            this.ProduitObjects[index] = { ...this.ProduitObject };
          }
          this.messageService.add({
            severity: "success",
            summary: "Succès",
            detail: "Catégorie mise à jour",
            life: 3000,
          });
          this.productDialog = false;
          this.ProduitObject = {};
          this.triggerLoadData();
        },
        error: (err:any) => {
          if (err.error && err.error.field) {
            // Mappe l'erreur en fonction du champ renvoyé par le backend
            this.errors[err.error.field] = err.error.message;
          }
        },
      });
    } else {
      this.ProduitService.createProduit(this.ProduitObject).subscribe({
        next: (newCategory: ProduitObject) => {
          this.ProduitObjects = [...this.ProduitObjects, newCategory];
          this.messageService.add({
            severity: "success",
            summary: "Succès",
            detail: "Catégorie créée",
            life: 3000,
          });
          this.productDialog = false;
          this.ProduitObject = {};
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
}
