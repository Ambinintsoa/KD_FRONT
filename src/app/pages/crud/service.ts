
import { Component, OnInit, signal, ViewChild } from '@angular/core';
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
import { ServiceObject,ServiceService } from '../service/service.service';

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
            [value]="ServiceObjects()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['nom_service', 'duree', 'prix', 'categorie']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedProducts"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate=" {first} à {last} sur {totalRecords} services    "
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
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
                    <th pSortableColumn="name" style="min-width:16rem">
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
                    <th pSortableColumn="name" style="min-width:16rem">
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
                                <p-radiobutton id="category1" name="category" value="Accessories" [(ngModel)]="ServiceObject.categorie" />
                                <label for="category1">Accessories</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category2" name="category" value="Clothing" [(ngModel)]="ServiceObject.categorie" />
                                <label for="category2">Clothing</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category3" name="category" value="Electronics" [(ngModel)]="ServiceObject.categorie" />
                                <label for="category3">Electronics</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category4" name="category" value="Fitness" [(ngModel)]="ServiceObject.categorie" />
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

    ServiceObjects = signal<ServiceObject[]>([]);

    ServiceObject!: ServiceObject;

    selectedProducts!: ServiceObject[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private ServiceService: ServiceService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        this.ServiceService.getProducts().then((data) => {
            this.ServiceObjects.set(data);
        });

        this.cols = [
            { field: 'nom_service', header: 'Nom' },
            { field: 'duree', header: 'Durée' },
            { field: 'prix', header: 'Prix' },
            { field: 'categorie', header: 'Catégorie' },

        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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
            message: 'Êtes-vous sûr de vouloir supprimer ce service',
            header: 'Confirmer',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.ServiceObjects.set(this.ServiceObjects().filter((val) => !this.selectedProducts?.includes(val)));
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Categorie supprimées',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product: ServiceObject) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer  ' + product.nom_service + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.ServiceObjects.set(this.ServiceObjects().filter((val) => val.id !== product.id));
                this.ServiceObject = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.ServiceObjects().length; i++) {
            if (this.ServiceObjects()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
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
        let _products = this.ServiceObjects();
        if (this.ServiceObject.nom_service?.trim()) {
            if (this.ServiceObject.id) {
                _products[this.findIndexById(this.ServiceObject.id)] = this.ServiceObject;
                this.ServiceObjects.set([..._products]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                this.ServiceObject.id = this.createId();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
                this.ServiceObjects.set([..._products, this.ServiceObject]);
            }

            this.productDialog = false;
            this.ServiceObject = {};
        }
    }
}
