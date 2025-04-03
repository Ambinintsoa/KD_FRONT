import { Component } from '@angular/core';
import { StatsWidget } from './components/statswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { CustomerSatisfactionWidget } from './components/customerSatistfactionWidget';
import { TopExpensiveProductsWidget } from "./components/recentsaleswidget";

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, BestSellingWidget, RevenueStreamWidget, CustomerSatisfactionWidget, TopExpensiveProductsWidget],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" />
            <div class="col-span-12 xl:col-span-6">
                
                <app-customer-satisfaction-widget/>
                <app-top-expensive-products-widget/>
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-best-selling-widget />
            </div>
        </div>
    `
})
export class Dashboard {}
