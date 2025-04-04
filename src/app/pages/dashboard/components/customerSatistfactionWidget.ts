import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { GraphService } from '../../service/graph.service';

@Component({
    standalone: true,
    selector: 'app-customer-satisfaction-widget',
    imports: [ChartModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Appréciation client</div>
        <p-chart type="radar" [data]="chartData" [options]="chartOptions" class="h-80" />
    </div>`
})
export class CustomerSatisfactionWidget implements OnInit, OnDestroy {
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;

    constructor(
        public layoutService: LayoutService,
        private graphService: GraphService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe(() => this.initChart());
    }

    ngOnInit() {
        this.loadScoreDistribution();
    }

    loadScoreDistribution() {
        this.graphService.getAvis().subscribe({
            next: (response) => {
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

    initChart(scoreData: any[] = []) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Labels basés sur les scores de 0 à 5
        const labels = scoreData.length ? scoreData.map(item => item.score.toString()) : ["0", "1", "2", "3", "4", "5"];
        const counts = scoreData.length ? scoreData.map(item => item.count) : [0, 0, 0, 0, 0, 0];

        this.chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Répartition des avis clients',
                    borderColor: documentStyle.getPropertyValue('--p-indigo-400'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--p-indigo-400'),
                    pointBorderColor: documentStyle.getPropertyValue('--p-indigo-400'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--p-indigo-400'),
                    data: counts
                }
            ]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.7,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    pointLabels: {
                        color: textColor
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1, // Pas de 1 pour des entiers
                        max: Math.max(...counts, 5) // Ajuster l'échelle maximale dynamiquement
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