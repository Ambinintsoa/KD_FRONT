
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
import { ServiceObject, ServiceResponse, ServiceService } from '../service/service.service';
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
            [value]="ServiceObjects"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['nom_service', 'duree', 'prix', 'categorie_service']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedProducts"
            [rowHover]="true"
            dataKey="_id"
            [sortField]="sortBy"
      [sortOrder]="orderBy === 'asc' ? 1 : -1"
      [rows]="limit"
            currentPageReportTemplate=" {first} à {last} sur {totalRecords} services    "
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
             (onLazyLoad)="onLazyLoad($event)"
      (onSort)="onSortChange($event)"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Gestion des Services</h5>
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
                    <th pSortableColumn="nom_service" style="min-width:16rem">
                        Service
                        <p-sortIcon field="nom_service" />
                    </th>
                    <th pSortableColumn="duree" style="min-width:16rem">
                        Durée
                        <p-sortIcon field="duree" />
                    </th>
                    <th pSortableColumn="prix" style="min-width:16rem">
                        Prix
                        <p-sortIcon field="prix" />
                    </th>
                    <th pSortableColumn="categorie_service" style="min-width:16rem">
                        Catégorie
                        <p-sortIcon field="categorie.nom_categorie" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-product>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="product" />
                    </td>
                    <td style="min-width: 16rem">{{ product.nom_service }}</td>
                    <td style="min-width: 16rem">{{ product.duree }}</td>
                    <td style="min-width: 16rem">{{ product.prix }}</td>
                    <td style="min-width: 16rem">{{ product.categorie?.nom_categorie }}</td>
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
                        <label for="name" class="block font-bold mb-3">Nom du service</label>
                        <input type="text" pInputText id="name" [(ngModel)]="ServiceObject.nom_service" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !ServiceObject.nom_service">Nom est requis.</small>
                    </div>
                    <div>
                        <label for="name" class="block font-bold mb-3">Durée du service</label>
                        <input type="number" pInputText id="name" [(ngModel)]="ServiceObject.duree" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !ServiceObject.duree">Durée est requis.</small>
                    </div>
                    <div>
                        <label for="name" class="block font-bold mb-3">Prix du service</label>
                        <input type="number" pInputText id="name" [(ngModel)]="ServiceObject.prix" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !ServiceObject.prix">Prix est requis.</small>
                    </div>
                    <div>
                        <span class="block font-bold mb-4">Category</span>
                        <div class="grid grid-cols-12 gap-4">
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category1" name="category" value="Accessories" [(ngModel)]="ServiceObject.categorie_service" />
                                <label for="category1">Accessories</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category2" name="category" value="Clothing" [(ngModel)]="ServiceObject.categorie_service" />
                                <label for="category2">Clothing</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category3" name="category" value="Electronics" [(ngModel)]="ServiceObject.categorie_service" />
                                <label for="category3">Electronics</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category4" name="category" value="Fitness" [(ngModel)]="ServiceObject.categorie_service" />
                                <label for="category4">Fitness</label>
                            </div>
                        </div>
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
    providers: [MessageService, ServiceService, ConfirmationService]
})
export class Service implements OnInit {
    productDialog: boolean = false;

     ServiceObjects: ServiceObject[] = [];

    ServiceObject!: ServiceObject;

    selectedProducts!: ServiceObject[] | null;

    submitted: boolean = false;
 private loadDataSubject = new Subject<ListParams>();
    statuses!: any[];
    totalRecords: number = 0;
    totalPages: number = 0;
    page: number = 1;
    limit: number = 10;
    first: number = 0;
    search: string = "";
    sortBy: string = "nom_service";
    orderBy: string = "asc";

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private ServiceService: ServiceService,
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
        this.cols = [{ field: "nom_service", header: "Nom" }];
    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
    this.loadDemoData(this.page, this.limit, this.search, this.sortBy, this.orderBy);
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
     this.ServiceService.getServices({ page, limit, search, sortBy, orderBy }).subscribe({
       next: (data: ServiceResponse) => {
         console.log("Réponse complète du backend :", data);
         this.ServiceObjects = data.services || [];
         this.totalRecords = data.totalItems || 0;
         this.totalPages = data.totalPages || 0;
         this.page = data.currentPage || 1;
         this.first = (this.page - 1) * this.limit;
         this.cdr.detectChanges();
         console.log("CategoryObjects après mise à jour :", this.ServiceObjects);
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
   onGlobalFilter(dt: any, event: any) {
        this.search = event.target.value;
        this.page = 1;
        this.first = 0;
        this.triggerLoadData();
    }

    openNew() {
        this.ServiceObject = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: ServiceObject) {
        this.ServiceObject = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
          message: "Êtes-vous sûr de vouloir supprimer ces services ?",
          header: "Confirmer",
          icon: "pi pi-exclamation-triangle",
          accept: () => {
            this.ServiceObjects = this.ServiceObjects.filter(
              (val) => !this.selectedProducts?.includes(val)
            );
            this.selectedProducts = null;
            this.messageService.add({
              severity: "success",
              summary: "Succès",
              detail: "Services supprimées",
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

  deleteProduct(product: ServiceObject) {
    this.confirmationService.confirm({
      message: "Êtes-vous sûr de vouloir supprimer " + product.nom_service + " ?",
      header: "Confirmer",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.ServiceService.deleteService(product).subscribe({
          next: () => {
            this.ServiceObjects = this.ServiceObjects.filter((item) => item._id !== product._id);
            this.messageService.add({
              severity: "success",
              summary: "Succès",
              detail: "Service supprimée",
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
        this.ServiceObject = {};
      },
    });
  }

  findIndexById(id: string): number {
    return this.ServiceObjects.findIndex((item) => item._id === id);
  }


    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }


  saveProduct() {
    this.submitted = true;
    if (!this.ServiceObject.nom_service?.trim()) return;

    if (this.ServiceObject._id) {
      this.ServiceService.updateService(this.ServiceObject).subscribe({
        next: () => {
          const index = this.findIndexById(this.ServiceObject._id ?? "");
          if (index !== -1) {
            this.ServiceObjects[index] = { ...this.ServiceObject };
          }
          this.messageService.add({
            severity: "success",
            summary: "Succès",
            detail: "Service mise à jour",
            life: 3000,
          });
          this.productDialog = false;
          this.ServiceObject = {};
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
      this.ServiceObject._id = this.createId();
      this.ServiceService.createService(this.ServiceObject).subscribe({
        next: (newCategory: ServiceObject) => {
          this.ServiceObjects = [...this.ServiceObjects, newCategory];
          this.messageService.add({
            severity: "success",
            summary: "Succès",
            detail: "Catégorie créée",
            life: 3000,
          });
          this.productDialog = false;
          this.ServiceObject = {};
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
