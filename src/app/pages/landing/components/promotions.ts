import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../service/service.service';
import { ButtonModule } from "primeng/button";
@Component({
  selector: 'app-promotions',
  standalone: true,
   imports: [CommonModule, CardModule, ButtonModule, CarouselModule],
  template: `<div class="container mx-auto px-4 py-12">
  <!-- Titre stylisé -->
  <h1 class="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-12 text-center tracking-tight">
    Nos Promotions en Cours
  </h1>

  <!-- Carousel -->
  <p-carousel 
    [value]="services" 
    [numVisible]="3" 
    [numScroll]="1" 
    [circular]="false" 
    [responsiveOptions]="responsiveOptions"
    [showIndicators]="true"
    [showNavigators]="true"
    [autoplayInterval]="3000"
    class="custom-carousel"
  >
    <ng-template let-service pTemplate="item">
      <div class="p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Header -->
          <div class=" text-white p-6">
            <h2 class="text-xl font-semibold tracking-wide">
              {{ service.nom_service }}
            </h2>
          </div>

          <!-- Contenu -->
          <div class="p-6">
            <p class="text-gray-700 dark:text-gray-300">
              <strong class="text-gray-900 dark:text-gray-100">Prix :</strong> 
              {{ service.prix || 'N/A' }} Ar
            </p>
            <p class="text-gray-700 dark:text-gray-300 mt-2">
              <strong class="text-gray-900 dark:text-gray-100">Catégorie :</strong> 
              {{ service.categorie_service?.nom_categorie || 'Non spécifiée' }}
            </p>

            <!-- Promotion active -->
            <div class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 class="text-lg font-medium text-yellow-800 dark:text-yellow-300">
                Promotion Active
              </h3>
              <p *ngIf="getPromotionActive(service) as promo; else noPromo" class="text-gray-700 dark:text-gray-300">
                <strong>Réduction :</strong> {{ promo.pourcentage_reduction }}%<br>
                <strong>Description :</strong> {{ promo.description || 'Sans description' }}<br>
                <strong>Valide :</strong> {{ promo.date_debut | date:'dd MMM yyyy' }} - {{ promo.date_fin | date:'dd MMM yyyy' }}
              </p>
              <ng-template #noPromo>
                <p class="text-gray-500 dark:text-gray-400">Aucune promotion active</p>
              </ng-template>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6">
            <button 
              pButton 
              type="button" 
              label="Réserver" 
              class="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
            ></button>
          </div>
        </div>
      </div>
    </ng-template>
  </p-carousel>

  <!-- Message si aucun service -->
  <div *ngIf="services.length === 0" class="text-center mt-12">
    <p class="text-gray-500 dark:text-gray-400 text-lg">
      Aucune promotion disponible pour le moment.
    </p>
  </div>
</div>

<!-- Styles personnalisés -->
<style>
  :host ::ng-deep .custom-carousel .p-carousel {
    @apply overflow-hidden;
  }

  :host ::ng-deep .custom-carousel .p-carousel-indicators {
    @apply mt-6;
  }

  :host ::ng-deep .custom-carousel .p-carousel-indicator > button {
    @apply w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-200;
  }

  :host ::ng-deep .custom-carousel .p-carousel-indicator.p-highlight > button {
    @apply bg-indigo-600 dark:bg-indigo-400;
  }

  :host ::ng-deep .custom-carousel .p-carousel-prev,
  :host ::ng-deep .custom-carousel .p-carousel-next {
    @apply bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 w-12 h-12 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200;
  }

  :host ::ng-deep .p-button {
    @apply shadow-none; /* Supprime l'ombre par défaut de PrimeNG */
  }
</style>
  `
})
export class PromotionsComponent implements OnInit {
    responsiveOptions = [
        {
          breakpoint: '1024px', // Large screens
          numVisible: 3,
          numScroll: 1
        },
        {
          breakpoint: '768px', // Medium screens
          numVisible: 2,
          numScroll: 1
        },
        {
          breakpoint: '560px', // Small screens
          numVisible: 1,
          numScroll: 1
        }
      ];
  services: any[] = [];

  constructor(private ServiceService: ServiceService) {}

  ngOnInit() {
    this.loadPromotions();
  }

  loadPromotions() {
    this.ServiceService.getPromotions().subscribe({
      next: (response: any) => {
        this.services = response.promotions;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des promotions:', err);
      }
    });
  }

  // Obtenir la promotion active (si pas déjà filtré par le backend)
  getPromotionActive(service: any): any {
    const now = new Date();
    return service.promotions.find((promo: { date_debut: string | number | Date; date_fin: string | number | Date; }) => 
      now >= new Date(promo.date_debut) && now <= new Date(promo.date_fin)
    );
  }
}