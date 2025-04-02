import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { FeaturesWidget } from './components/featureswidget';
import { FooterWidget } from './components/footerwidget';
<<<<<<< HEAD
import { HeroWidget } from './components/herowidget';
import { HighlightsWidget } from './components/highlightswidget';
import { TopbarwidgetComponent } from './components/topbarwidgets/topbarwidget/topbarwidget.component';
// import { TopbarwidgetComponent } from './components/topbarwidget/topbarwidget.component';
=======
import {PromotionsComponent} from './components/promotions';
import { AvisValidesComponent } from "./components/AvisValidesComponent";
>>>>>>> 3075603cf5b0a72e1137f24b6e7570def8407f53

@Component({
    selector: 'app-landing',
    standalone: true,
<<<<<<< HEAD
    imports: [RouterModule, TopbarwidgetComponent, HeroWidget, FeaturesWidget, HighlightsWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule],
=======
    imports: [RouterModule, TopbarWidget, HeroWidget, FeaturesWidget, HighlightsWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule, PromotionsComponent, AvisValidesComponent],
>>>>>>> 3075603cf5b0a72e1137f24b6e7570def8407f53
    template: `
        <div class="bg-surface-0 dark:bg-surface-900">
            <div id="home" class="landing-wrapper overflow-hidden">
                <topbarwidget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
                <hero-widget />
                <features-widget />
                <app-promotions/>
                <highlights-widget />
                <app-avis-valides/>
                <footer-widget />
            </div>
        </div>
    `
})
export class Landing {}
