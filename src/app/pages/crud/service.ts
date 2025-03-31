import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
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
import {
  Promotion,
  ServiceObject,
  ServiceResponse,
  ServiceService,
} from "../service/service.service";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";
import { ListParams } from "../service/Params";
import {
  CategoryResponse,
  CategoryService,
} from "../service/category.service ";

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
          (onClick)="exportCSV()"
        />
      </ng-template>
    </p-toolbar>

    <p-table
      #dt
      [value]="ServiceObjects"
      [columns]="cols"
      [paginator]="true"
      [globalFilterFields]="[
        'nom_service',
        'duree',
        'prix',
        'categorie_service',
      ]"
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
          <th pSortableColumn="promotion" style="min-width:16rem">
            Promotion (en %)
            <p-sortIcon field="categorie.promotion" />
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
          <td style="min-width: 16rem">
            {{ product.categorie?.nom_categorie }}
          </td>
          <td style="min-width: 16rem">
            {{
              getPromotionActive(product)
            }}
          </td>
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
      header="Détails Service"
      [modal]="true"
    >
      <ng-template #content>
        <div class="flex flex-col gap-6">
          <div>
            <label for="name" class="block font-bold mb-3"
              >Nom du service</label
            >
            <input
              type="text"
              pInputText
              id="name"
              [(ngModel)]="ServiceObject.nom_service"
              required
              autofocus
              fluid
            />
            <small
              class="text-red-500"
              *ngIf="submitted && !ServiceObject.nom_service"
              >Nom est requis.</small
            >
            <small class="text-red-500" *ngIf="errors?.nom_service">
              {{ errors.nom_service }}
            </small>
          </div>
          <div>
            <label for="name" class="block font-bold mb-3"
              >Durée du service(min)</label
            >
            <input
              type="number"
              pInputText
              id="name"
              [(ngModel)]="ServiceObject.duree"
              required
              autofocus
              fluid
            />
            <small
              class="text-red-500"
              *ngIf="submitted && !ServiceObject.duree"
              >Durée est requis.</small
            >
            <small class="text-red-500" *ngIf="errors?.duree">
              {{ errors.duree }}
            </small>
          </div>
          <div>
            <label for="name" class="block font-bold mb-3"
              >Prix du service</label
            >
            <input
              type="number"
              pInputText
              id="name"
              [(ngModel)]="ServiceObject.prix"
              required
              autofocus
              fluid
            />
            <small class="text-red-500" *ngIf="submitted && !ServiceObject.prix"
              >Prix est requis.</small
            >
            <small class="text-red-500" *ngIf="errors?.prix">
              {{ errors.prix }}
            </small>
          </div>
          <div>
            <span class="block font-bold mb-4">Categories</span>
            <div class="grid grid-cols-12 gap-4">
              <!-- Dynamically generate radio buttons for categories -->
              <div
                *ngFor="let category of categories"
                class="flex items-center gap-2 col-span-6"
              >
                <p-radiobutton
                  [id]="'category' + category._id"
                  name="categorie_service"
                  [value]="category._id"
                  [(ngModel)]="ServiceObject.categorie._id"
                />
                <label [for]="'category' + category._id">{{
                  category.nom_categorie
                }}</label>
              </div>
              <small class="text-red-500" *ngIf="errors?.categorie_service">
                {{ errors.categorie_service }}
              </small>
            </div>
          </div>
<!-- Section pour ajouter une promotion -->
<div class="mt-4">
    <label class="block font-bold mb-3">Ajouter une promotion</label>

    <!-- Pourcentage de réduction -->
    <div class="mb-4">
      <label for="pourcentage_reduction" class="block mb-1">Pourcentage de réduction (%)</label>
      <input
        type="number"
        pInputText
        id="pourcentage_reduction"
        [(ngModel)]="promotion.pourcentage_reduction"
        required
        min="0"
        max="100"
        placeholder="Ex. 20"
        class="w-full"
      />
      <small class="text-red-500" *ngIf="submitted && !promotion.pourcentage_reduction">
        Le pourcentage est requis.
      </small>
    </div>

    <!-- Date de début -->
    <div class="mb-4">
      <label for="date_debut" class="block mb-1">Date de début</label>
      <input
        type="date"
        id="date_debut"
        [(ngModel)]="promotion.date_debut"
        required
        class="mt-1 w-full border border-gray-300 rounded-md p-3"
      />
    </div>

    <!-- Date de fin -->
    <div class="mb-4">
      <label for="date_fin" class="block mb-1">Date de fin</label>
      <input
        type="date"
        id="date_fin"
        [(ngModel)]="promotion.date_fin"
        required
        class="mt-1 w-full border border-gray-300 rounded-md p-3"
      />
      <small class="text-red-500" *ngIf="submitted && promotion.pourcentage_reduction && !promotion.date_fin">
        La date de fin est requise.
      </small>
      <small class="text-red-500" *ngIf="submitted && promotion.date_debut && promotion.date_fin && promotion.date_debut > promotion.date_fin">
        La date de fin doit être postérieure à la date de début.
      </small>
    </div>

    <!-- Description (optionnel) -->
    <div class="mb-4">
      <label for="description" class="block mb-1">Description (optionnel)</label>
      <input
        type="text"
        pInputText
        id="description"
        [(ngModel)]="promotion.description"
        placeholder="Ex. Promotion de printemps"
        class="w-full"
      />
      <button pButton type="button" label="Ajouter la promotion" (click)="addPromotion()" class="mt-2"></button>
      </div>
      <!-- Affichage des promotions ajoutées (optionnel) -->
<div class="mt-4" *ngIf="  ServiceObject.promotions?.length||0 > 0">
  <label class="block font-bold mb-3">Promotions ajoutées</label>
  <ul>
    <li *ngFor="let promo of ServiceObject.promotions; let i = index">
      {{ promo.pourcentage_reduction }}% - Du {{ promo.date_debut | date }} au {{ promo.date_fin | date }} 
      ({{ promo.description || 'Sans description' }}) 
      <button pButton type="button" label="Supprimer" (click)="removePromotion(i)" class="ml-2 p-button-danger"></button>
    </li>
  </ul>
</div>
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
  providers: [MessageService, ServiceService, ConfirmationService],
})
export class Service implements OnInit {
  promotion: Promotion = {
    pourcentage_reduction: null,
    date_debut: null,
    date_fin: null,
    description: ''
  };
  errors: any = {};
  productDialog: boolean = false;

  ServiceObjects: ServiceObject[] = [];

  ServiceObject!: ServiceObject;

  selectedProducts!: ServiceObject[] | null;
  categories: any[] = []; // Liste des catégories
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

  @ViewChild("dt") dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];

  constructor(
    private ServiceService: ServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService
  ) {
    this.loadCategories();
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

  exportCSV() {
    this.dt.exportCSV();
  }

  ngOnInit() {
    this.cols = [{ field: "nom_service", header: "Nom" }];
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
    );
  }

  getPromotionActive(product: any): any {
    const now = new Date();
    const promotionActive = product.promotions?.find(
      (promo: {
        date_debut: string | number | Date;
        date_fin: string | number | Date;
      }) => now >= new Date(promo.date_debut) && now <= new Date(promo.date_fin)
    );
    return promotionActive
    ? `${promotionActive.pourcentage_reduction}% (${promotionActive.description || 'Sans description'})`
    : "Aucune promotion active";
  }
  // Ajouter une promotion au tableau
  addPromotion() {
    
    this.errors = {};

    // Validation
    if (!this.promotion.pourcentage_reduction) {
      this.errors.pourcentage_reduction = 'Le pourcentage est requis';
    }
    if (!this.promotion.date_debut) {
      this.errors.date_debut = 'La date de début est requise';
    }
    if (!this.promotion.date_fin) {
      this.errors.date_fin = 'La date de fin est requise';
    }
    if (this.promotion.date_debut && this.promotion.date_fin && this.promotion.date_debut > this.promotion.date_fin) {
      this.errors.date_fin = 'La date de fin doit être postérieure à la date de début';
    }

    // Si aucune erreur, ajouter au tableau
    if (Object.keys(this.errors).length === 0 ) {
      this.ServiceObject.promotions?.push({ ...this.promotion });
      console.log(this.ServiceObject)
      this.resetPromotion(); // Réinitialiser les champs
    }
  }
// Supprimer une promotion du tableau
removePromotion(index: number) {
  this.ServiceObject.promotions?.splice(index, 1);
}

// Réinitialiser les champs de promotion
resetPromotion() {
  this.promotion = {
    pourcentage_reduction: null,
    date_debut: null,
    date_fin: null,
    description: ''
  };
  this.submitted = false;
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
    this.ServiceService.getServices({
      page,
      limit,
      search,
      sortBy,
      orderBy,
    }).subscribe({
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
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data: CategoryResponse) => {
        console.log("Réponse complète du backend :", data);
        this.categories = data.categories || [];
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
    this.ServiceObject = {
      nom_service: "", // Valeur par défaut
      duree: 0, // Valeur par défaut
      prix: 0, // Valeur par défaut
      categorie: { _id: null },
      promotions:[]
    };
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: ServiceObject) {
    console.log(product);
    this.ServiceObject = { ...product };
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: "Êtes-vous sûr de vouloir supprimer ces services ?",
      header: "Confirmer",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        const ids: string[] =
          this.selectedProducts
            ?.filter((cat) => !!cat._id)
            .map((cat) => String(cat._id)) ?? [];
        this.ServiceService.deleteService(ids).subscribe({
          next: () => {
            this.ServiceObjects = this.ServiceObjects.filter(
              (val) => !this.selectedProducts?.includes(val)
            );
            this.messageService.add({
              severity: "success",
              summary: "Succès",
              detail: "Service supprimé",
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
        this.ServiceObject = {};
      },
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteProduct(product: ServiceObject) {
    this.confirmationService.confirm({
      message:
        "Êtes-vous sûr de vouloir supprimer " + product.nom_service + " ?",
      header: "Confirmer",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.ServiceService.deleteService([product._id || ""]).subscribe({
          next: () => {
            this.ServiceObjects = this.ServiceObjects.filter(
              (item) => item._id !== product._id
            );
            this.messageService.add({
              severity: "success",
              summary: "Succès",
              detail: "Service supprimée",
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
        this.ServiceObject = {};
      },
    });
  }

  findIndexById(id: string): number {
    return this.ServiceObjects.findIndex((item) => item._id === id);
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
        error: (err: any) => {
          if (err.error && Array.isArray(err.error.errors)) {
            // Si le backend renvoie plusieurs erreurs dans un tableau
            err.error.errors.forEach(
              (error: { field: string; message: string }) => {
                // Mappe l'erreur en fonction du champ renvoyé par le backend
                this.errors[error.field] = error.message;
              }
            );
          }
        },
      });
    } else {
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
        error: (err: any) => {
          if (err.error && Array.isArray(err.error.errors)) {
            // Si le backend renvoie plusieurs erreurs dans un tableau
            err.error.errors.forEach(
              (error: { field: string; message: string }) => {
                // Mappe l'erreur en fonction du champ renvoyé par le backend
                this.errors[error.field] = error.message;
              }
            );
            console.log(this.errors);
          }
        },
      });
    }
  }
}
