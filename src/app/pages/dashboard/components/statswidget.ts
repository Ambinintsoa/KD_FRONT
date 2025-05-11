import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphService } from '../../service/graph.service';// Assurez-vous que le chemin est correct

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Nombre de rendez-vous</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalRendezVous }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Chiffre d'affaire</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalChiffreAffaire | number }} Ar</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Recettes</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalPaiements | number }} Ar</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Dépenses</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalStockValue | number }} Ar</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-comment text-purple-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>`
})
export class StatsWidget implements OnInit {
    totalRendezVous: number = 0;
    totalPaiements: number = 0;
    totalStockValue: number = 0;
    totalChiffreAffaire: number=0;
    constructor(private graphService: GraphService) {}

    ngOnInit() {
        this.loadStats();
    }

    loadStats() {
        this.graphService.getStat().subscribe({
            next: (response) => {
                if (response.success) {
                    this.totalPaiements = response.data.totalMontant;
                    this.totalChiffreAffaire = response.data.totalChiffreAffaire;
                    this.totalRendezVous = response.data.totalRendezVous;
                    this.totalStockValue = response.data.totalStockValue;
                } else {
                    this.totalPaiements = 0;
                    this.totalRendezVous = 0;
                    this.totalStockValue = 0;
                }
            },
            error: (err) => {
                this.totalPaiements = 0;
                this.totalRendezVous = 0;
                this.totalStockValue = 0;
            }
        });
    }
}