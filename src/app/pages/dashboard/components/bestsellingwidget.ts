import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { GraphService } from '../../service/graph.service';

@Component({
    standalone: true,
    selector: 'app-best-selling-widget',
    imports: [CommonModule, ButtonModule, MenuModule],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-6">
                <div class="font-semibold text-xl">Services les plus demandés</div>
                <div>
                    <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="menu.toggle($event)"></button>
                    <p-menu #menu [popup]="true" [model]="items"></p-menu>
                </div>
            </div>
            <ul class="list-none p-0 m-0">
                <li *ngFor="let service of topServices; let i = index" class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">{{ service.nom }}</span>
                        <div class="mt-1 text-muted-color">{{ service.categorie }}</div>
                    </div>
                    <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                        <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                            <div [ngStyle]="{'width': service.percentage + '%', 'background-color': colors[i % colors.length]}" class="h-full"></div>
                        </div>
                        <span [ngStyle]="{'color': colors[i % colors.length]}" class="ml-4 font-medium">{{ service.percentage }}%</span>
                    </div>
                </li>
            </ul>
        </div>`
})
export class BestSellingWidget implements OnInit {
    @ViewChild('menu') menu!: Menu;

    items = [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-trash' }
    ];

    topServices: any[] = [];
    colors = [
        '#f97316', // orange-500
        '#06b6d4', // cyan-500
        '#ec4899', // pink-500
        '#22c55e', // green-500
        '#9333ea', // purple-500
        '#14b8a6', // teal-500
        '#3b82f6', // blue-500
        '#ef4444', // red-500
        '#eab308', // yellow-500
        '#8b5cf6'  // violet-500
    ];

    constructor(private graphService: GraphService) {}

    ngOnInit() {
        this.loadTopServices();
    }

    loadTopServices() {
        this.graphService.getTop10().subscribe({
            next: (response) => {
                if (response.success) {
                    this.topServices = response.data;
                } else {
                    this.topServices = [];
                }
            },
            error: (err) => {
                console.error('Erreur:', err);
                this.topServices = [];
            }
        });
    }
}