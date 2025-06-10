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
import { ProduitService, Produit, UsageProduitService } from '../service/produit.service';
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
import { FileUploadModule } from "primeng/fileupload";
import { DropdownModule } from "primeng/dropdown";
import { layoutConfig } from '../../layout/service/layout.service';
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
    FileUploadModule,
    DropdownModule
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
  [style]="{ width: '600px' }"
  header="Détails Service"
  [modal]="true"
>
  <ng-template #content>
    <div class="flex flex-col gap-6">
      <!-- Navigation Étapes -->
      <div class="flex justify-between items-center mb-4">
        <p-button pButton label="« Précédent" (click)="prevStep()" [disabled]="currentStep === 0" />
        <span class="font-semibold">Étape {{ currentStep + 1 }} / 4</span>
        <p-button pButton label="Suivant »" (click)="nextStep()" [disabled]="currentStep === maxStep" />
      </div>

      <!-- Étape 1: Informations de base -->
      <div *ngIf="currentStep === 0" class="flex flex-col gap-6">
        <div>
          <label class="block font-bold mb-3">Nom du service</label>
          <input type="text" pInputText [(ngModel)]="ServiceObject.nom_service" required autofocus />
          <small class="text-red-500" *ngIf="submitted && !ServiceObject.nom_service">Nom est requis.</small>
          <small class="text-red-500" *ngIf="errors?.nom_service">{{ errors.nom_service }}</small>
        </div>
        <div>
          <label class="block font-bold mb-3">Durée du service (min)</label>
          <input type="number" pInputText [(ngModel)]="ServiceObject.duree" required />
          <small class="text-red-500" *ngIf="submitted && !ServiceObject.duree">Durée est requise.</small>
          <small class="text-red-500" *ngIf="errors?.duree">{{ errors.duree }}</small>
        </div>
        <div>
          <label class="block font-bold mb-3">Prix du service</label>
          <input type="number" pInputText [(ngModel)]="ServiceObject.prix" required />
          <small class="text-red-500" *ngIf="submitted && !ServiceObject.prix">Prix est requis.</small>
          <small class="text-red-500" *ngIf="errors?.prix">{{ errors.prix }}</small>
        </div>
      </div>

      <!-- Étape 2: Catégories -->
      <div *ngIf="currentStep === 1">
        <span class="block font-bold mb-4">Catégories</span>
        <div class="grid grid-cols-12 gap-4">
          <div *ngFor="let category of categories" class="flex items-center gap-2 col-span-6">
            <p-radiobutton
              [id]="'category' + category._id"
              name="categorie_service"
              [value]="category._id"
              [(ngModel)]="ServiceObject.categorie._id"
            />
            <label [for]="'category' + category._id">{{ category.nom_categorie }}</label>
          </div>
        </div>
        <small class="text-red-500" *ngIf="errors?.categorie_service">{{ errors.categorie_service }}</small>
      </div>

      <!-- Étape 3: Promotion -->
      <div *ngIf="currentStep === 2">
        <label class="block font-bold mb-3">Ajouter une promotion</label>

        <div class="mb-4">
          <label class="block mb-1">Pourcentage de réduction (%)</label>
          <input type="number" pInputText [(ngModel)]="promotion.pourcentage_reduction" min="0" max="100" class="w-full" />
          <small class="text-red-500" *ngIf="submitted && !promotion.pourcentage_reduction">Le pourcentage est requis.</small>
        </div>

        <div class="mb-4">
          <label class="block mb-1">Date de début</label>
          <input type="date" [(ngModel)]="promotion.date_debut" class="w-full border rounded-md p-2" />
        </div>

        <div class="mb-4">
          <label class="block mb-1">Date de fin</label>
          <input type="date" [(ngModel)]="promotion.date_fin" class="w-full border rounded-md p-2" />
          <small class="text-red-500" *ngIf="submitted && promotion.pourcentage_reduction && !promotion.date_fin">
            La date de fin est requise.
          </small>
          <small class="text-red-500" *ngIf="submitted && promotion.date_debut && promotion.date_fin && promotion.date_debut > promotion.date_fin">
            La date de fin doit être postérieure à la date de début.
          </small>
        </div>

        <div class="mb-4">
          <label class="block mb-1">Description (optionnel)</label>
          <input type="text" pInputText [(ngModel)]="promotion.description" class="w-full" />
          <p-button pButton label="Ajouter la promotion" (click)="addPromotion()" class="mt-2" />
        </div>

        <div class="mt-4" *ngIf="ServiceObject.promotions?.length||0 > 0">
          <label class="block font-bold mb-3">Promotions ajoutées</label>
          <ul>
            <li *ngFor="let promo of ServiceObject.promotions; let i = index">
              {{ promo.pourcentage_reduction }}% - Du {{ promo.date_debut | date }} au {{ promo.date_fin | date }}
              ({{ promo.description || 'Sans description' }})
              <p-button pButton label="Supprimer" class="ml-2 p-button-danger" (click)="removePromotion(i)" />
            </li>
          </ul>
        </div>
      </div>

      <!-- Étape 4: Produits utilisés -->
      <div *ngIf="currentStep === 3">
        <label class="block font-bold mb-3">Ajouter des produits utilisés</label>

        <div class="mb-4">
          <label class="block mb-1">Produit</label>
          <p-dropdown
            [options]="produits"
            [(ngModel)]="selectedProduit"
            optionLabel="nom_produit"
            optionValue="_id"
            placeholder="Sélectionner un produit"
            class="w-full"
          ></p-dropdown>
        </div>

        <div class="mb-4">
          <label class="block mb-1">Quantité</label>
          <input type="number" pInputText [(ngModel)]="quantiteProduit" min="1" class="w-full" />
        </div>

        <p-button pButton label="Ajouter le produit" (click)="addProduitToService()" class="mt-2" [disabled]="!selectedProduit" />

        <div class="mt-4" *ngIf="produitsUtilises.length > 0">
          <label class="block font-bold mb-3">Produits utilisés</label>
          <ul>
            <li *ngFor="let produitUtilise of produitsUtilises">
              {{ produitUtilise.produit.nom_produit }} - Quantité: {{ produitUtilise.quantite }}
              <p-button pButton label="Supprimer" class="ml-2 p-button-danger" (click)="removeProduitUtilise(produitUtilise)" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </ng-template>

  <ng-template #footer>
    <p-button label="Annuler" icon="pi pi-times" text (click)="hideDialog()" />
    <p-button label="Enregistrer" icon="pi pi-check" (click)="saveProduct()" [disabled]="currentStep < maxStep" />
  </ng-template>
</p-dialog>


    <p-confirmdialog [style]="{ width: '450px' }" />
  `,
  providers: [MessageService, ServiceService, ConfirmationService, ProduitService],
})
export class Service implements OnInit {
  currentStep = 0;
maxStep = 3;

nextStep() {
  if (this.currentStep < this.maxStep) {
    this.currentStep++;
  }
}

prevStep() {
  if (this.currentStep > 0) {
    this.currentStep--;
  }
}

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
  produits: Produit[] = [];
  selectedProduit: string | null = null;
  produitsUtilises: UsageProduitService[] = [];
  quantiteProduit: number = 1;
  @ViewChild("dt") dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];

  constructor(
    private ServiceService: ServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    private produitService: ProduitService
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
    this.loadProduits();
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
        this.ServiceObjects = data.services || [];
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
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data: CategoryResponse) => {
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
 
     this.ServiceService.uploadFile(this.selectedFile).subscribe({
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
 
     this.ServiceService.exportToExcel().subscribe({
       next: (blob: Blob) => {
         this.categoryService.downloadFile(blob, "services.xlsx");
         this.message = "Exportation réussie !";
       },
       error: (err: any) => {
         this.message = "Erreur lors de l'exportation : " + err.message;
       },
     });
   }
   // Nouvelles méthodes
   loadProduits() {
    this.produitService.getAllProduits().subscribe({
        next: (produits) => {
            this.produits = produits;
        },
        error: (err) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Échec du chargement des produits'
            });
        }
    });
}

loadProduitsUtilises(serviceId: string) {
    this.produitService.getProduitsByService(serviceId).subscribe({
        next: (produitsUtilises) => {
            this.produitsUtilises = produitsUtilises;
        }
    });
}

addProduitToService() {
    if (!this.selectedProduit || !this.ServiceObject._id) return;
    this.produitService.addProduitToService(
        this.ServiceObject._id,
        this.selectedProduit,
        this.quantiteProduit
    ).subscribe({
        next: () => {
            this.loadProduitsUtilises(this.ServiceObject._id!);
            this.selectedProduit = null;
            this.quantiteProduit = 1;
            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Produit ajouté au service'
            });
        },
        error: (err) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Échec de l\'ajout du produit'
            });
        }
    });
}

removeProduitUtilise(produitUtilise: UsageProduitService) {
    this.produitService.removeProduitFromService(
        this.ServiceObject._id!,
        produitUtilise.produit._id!
    ).subscribe({
        next: () => {
            this.loadProduitsUtilises(this.ServiceObject._id!);
            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Produit retiré du service'
            });
        }
    });
}

// Modifier openNew et editProduct pour charger les produits utilisés
openNew() {
    this.ServiceObject = {
        nom_service: "",
        duree: 0,
        prix: 0,
        categorie: { _id: null },
        promotions: []
    };
    this.produitsUtilises = [];
    this.submitted = false;
    this.productDialog = true;
}

editProduct(product: ServiceObject) {
    this.ServiceObject = { ...product };
    this.loadProduitsUtilises(product._id!);
    this.productDialog = true;
}
}
