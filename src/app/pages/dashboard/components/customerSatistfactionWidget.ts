import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';

@Component({
    standalone: true,
    selector: 'app-customer-satisfaction-widget',
    imports: [ChartModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Appréciation client</div>
        <p-chart type="radar" [data]="chartData" [options]="chartOptions" class="h-80" />
    </div>`
})
export class CustomerSatisfactionWidget {
    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    constructor(public layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.initChart();
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['Suspension et Direction', 'Remplacement et embrellage', 'Entretiens courants', 'Batterie et électricité', 'Système de freinage', 'Autres services'],
            datasets: [
                {
                    label: 'Mecanicien 1',
                    borderColor: documentStyle.getPropertyValue('--p-indigo-400'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--p-indigo-400'),
                    pointBorderColor: documentStyle.getPropertyValue('--p-indigo-400'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--p-indigo-400'),
                    data: [65, 59, 90, 81, 56, 55]
                },
                {
                    label: 'Mecanicien 2',
                    borderColor: documentStyle.getPropertyValue('--p-purple-400'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--p-purple-400'),
                    pointBorderColor: documentStyle.getPropertyValue('--p-purple-400'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--p-purple-400'),
                    data: [28, 48, 40, 19, 96, 100]
                },
                {
                    label: 'Mecanicien 3',
                    borderColor: documentStyle.getPropertyValue('--p-red-400'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--p-red-400'),
                    pointBorderColor: documentStyle.getPropertyValue('--p-red-400'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--p-red-400'),
                    data: [80, 48,  90, 9, 27, 100]
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
