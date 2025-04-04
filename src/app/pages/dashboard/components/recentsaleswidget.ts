import { Component, OnInit } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { GraphService } from '../../service/graph.service';

@Component({
    standalone: true,
    selector: 'app-top-expensive-products-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `
        <div class="card !mb-8">
            <div class="font-semibold text-xl mb-4">Top 10 des produits les plus coûteux</div>
            <p-table [value]="products" [paginator]="true" [rows]="5" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th pSortableColumn="nom">Nom </th>
                        <th pSortableColumn="prixUnitaire">Prix unitaire </th>
                        <th pSortableColumn="quantiteEntree">Quantité entrée </th>
                        <th pSortableColumn="totalValue">Valeur totale </th>
                        <th>Voir</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-product>
                    <tr>
                        <td style="width: 25%; min-width: 7rem;">{{ product.nom }}</td>
                        <td style="width: 20%; min-width: 8rem;">{{ product.prixUnitaire | currency: 'Ar' }}</td>
                        <td style="width: 20%; min-width: 8rem;">{{ product.quantiteEntree }}</td>
                        <td style="width: 20%; min-width: 8rem;">{{ product.totalValue | currency: 'Ar' }}</td>
                        <td style="width: 10%;">
                            <button pButton pRipple type="button" icon="pi pi-search" class="p-button p-component p-button-text p-button-icon-only"></button>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>`
})
export class TopExpensiveProductsWidget implements OnInit {
    products: any[] = [];

    constructor(private graphService: GraphService) {}

    ngOnInit() {
        this.loadTopExpensiveProducts();
    }

    loadTopExpensiveProducts() {
        this.graphService.getExpesiveProduct().subscribe({
            next: (response) => {
                if (response.success) {
                    this.products = response.data;
                } else {
                    this.products = [];
                }
            },
            error: (err) => {
                console.error('Erreur:', err);
                this.products = [];
            }
        });
    }
}