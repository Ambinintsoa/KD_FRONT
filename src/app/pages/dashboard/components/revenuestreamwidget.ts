import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { GraphService } from '../../service/graph.service';

@Component({
    standalone: true,
    selector: 'app-revenue-stream-widget',
    imports: [ChartModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Revenus et paiements par mois ({{ currentYear }})</div>
        <p-chart type="bar" [data]="chartData" [options]="chartOptions" class="h-80" />
    </div>`
})
export class RevenueStreamWidget implements OnInit, OnDestroy {
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;
    currentYear: number = new Date().getFullYear();

    constructor(
        public layoutService: LayoutService,
        private graphService: GraphService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe(() => this.initChart());
    }

    ngOnInit() {
        this.loadPaiementsData();
    }

    loadPaiementsData() {
        this.graphService.getPaiementsParMois().subscribe({
            next: (response) => {
                console.log('Données reçues:', response);
                if (response.success) {
                    this.initChart(response.data);
                } else {
                    this.initChart([]);
                }
            },
            error: (err) => {
                console.error('Erreur:', err);
                this.initChart([]);
            }
        });
    }

    initChart(paiementData: any[] = []) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const montants = paiementData.map(data => data.totalMontant || 0);
        const nombrePaiements = paiementData.map(data => data.nombrePaiements || 0);

        this.chartData = {
            labels: labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Revenus mensuels (€)',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                    data: montants,
                    barThickness: 32,
                    borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
                    borderSkipped: false,
                    yAxisID: 'yMontant' // Associer à l'échelle des montants
                },
                {
                    type: 'bar',
                    label: 'Nombre de paiements',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                    data: nombrePaiements,
                    barThickness: 32,
                    borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
                    borderSkipped: false,
                    yAxisID: 'yPaiements' // Associer à l'échelle des paiements
                }
            ]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: { color: textColor }
                }
            },
            scales: {
                x: {
                    ticks: { color: textMutedColor },
                    grid: { color: 'transparent', borderColor: 'transparent' }
                },
                yMontant: { // Échelle pour les montants (à gauche)
                    position: 'left',
                    ticks: {
                        color: textMutedColor,
                        callback: (value: number) => `${value} €`
                    },
                    grid: { color: borderColor, borderColor: 'transparent', drawTicks: false },
                    title: {
                        display: true,
                        text: 'Montant (€)',
                        color: textColor
                    }
                },
                yPaiements: { // Échelle pour le nombre de paiements (à droite)
                    position: 'right',
                    ticks: {
                        color: textMutedColor,
                        stepSize: 1 // Pas de 1 pour les nombres entiers
                    },
                    grid: { display: false }, // Pas de grille pour cette échelle
                    title: {
                        display: true,
                        text: 'Nb Paiements',
                        color: textColor
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}