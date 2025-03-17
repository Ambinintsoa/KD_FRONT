
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
import { UtilisateurObject,UtilisateurService } from '../service/utilisateur.service';

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
            [value]="UtilisateurObjects()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['nom_service', 'duree', 'prix', 'categorie']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedProducts"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate=" {first} à {last} sur {totalRecords} utilisateurs    "
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Gestion des Utilisateurs</h5>
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
                        Nom
                        <p-sortIcon field="nom" />
                    </th>
                    <th pSortableColumn="prenom" style="min-width:16rem">
                        Prénom
                        <p-sortIcon field="prenom" />
                    </th>
                    <th pSortableColumn="email" style="min-width:16rem">
                        Email
                        <p-sortIcon field="email" />
                    </th>
                    <th pSortableColumn="adresse" style="min-width:16rem">
                        Adresse
                        <p-sortIcon field="adresse" />
                    </th>
                    <th pSortableColumn="contact" style="min-width:16rem">
                        Contact
                        <p-sortIcon field="contact" />
                    </th>
                    <th pSortableColumn="poste" style="min-width:16rem">
                        Poste
                        <p-sortIcon field="poste" />
                    </th>
                    <th pSortableColumn="Genre" style="min-width:16rem">
                        genre
                        <p-sortIcon field="genre" />
                    </th>
                    <th pSortableColumn="date_de_naissance" style="min-width:16rem">
                        Date de naissance
                        <p-sortIcon field="date_de_naissance" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-product>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="product" />
                    </td>
                    <td style="min-width: 16rem">{{ product.nom }}</td>
                    <td style="min-width: 16rem">{{ product.prenom }}</td>
                    <td style="min-width: 16rem">{{ product.email }}</td>
                    <td style="min-width: 16rem">{{ product.adresse }}</td>
                    <td style="min-width: 16rem">{{ product.contact }}</td>
                    <td style="min-width: 16rem">{{ product.poste }}</td>
                    <td style="min-width: 16rem">{{ product.genre }}</td>
                    <td style="min-width: 16rem">{{ product.date_de_naissance }}</td>
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
                        <label for="name" class="block font-bold mb-3">Nom</label>
                        <input type="text" pInputText id="name" [(ngModel)]="UtilisateurObject.nom" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !UtilisateurObject.nom">Nom est requis.</small>
                    </div>
                    <div>
                        <label for="name" class="block font-bold mb-3">Durée du service</label>
                        <input type="text" pInputText id="name" [(ngModel)]="UtilisateurObject.prenom"  autofocus fluid />
                    </div>
                    <div>
                        <label for="name" class="block font-bold mb-3">Prix du service</label>
                        <input type="text" pInputText id="name" [(ngModel)]="UtilisateurObject.adresse" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !UtilisateurObject.adresse">Prix est requis.</small>
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
    providers: [MessageService, UtilisateurService, ConfirmationService]
})
export class Utilisateur implements OnInit {
    productDialog: boolean = false;

    UtilisateurObjects = signal<UtilisateurObject[]>([]);

    UtilisateurObject!: UtilisateurObject;

    selectedProducts!: UtilisateurObject[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private UtilisateurService: UtilisateurService,
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
        this.UtilisateurService.getProducts().then((data) => {
            this.UtilisateurObjects.set(data);
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
        this.UtilisateurObject = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: UtilisateurObject) {
        this.UtilisateurObject = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur',
            header: 'Confirmer',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.UtilisateurObjects.set(this.UtilisateurObjects().filter((val) => !this.selectedProducts?.includes(val)));
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

    deleteProduct(product: UtilisateurObject) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer  ' + product.nom + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.UtilisateurObjects.set(this.UtilisateurObjects().filter((val) => val.id !== product.id));
                this.UtilisateurObject = {};
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
        for (let i = 0; i < this.UtilisateurObjects().length; i++) {
            if (this.UtilisateurObjects()[i].id === id) {
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
        let _products = this.UtilisateurObjects();
        if (this.UtilisateurObject.nom?.trim()) {
            if (this.UtilisateurObject.id) {
                _products[this.findIndexById(this.UtilisateurObject.id)] = this.UtilisateurObject;
                this.UtilisateurObjects.set([..._products]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                this.UtilisateurObject.id = this.createId();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
                this.UtilisateurObjects.set([..._products, this.UtilisateurObject]);
            }

            this.productDialog = false;
            this.UtilisateurObject = {};
        }
    }
}
