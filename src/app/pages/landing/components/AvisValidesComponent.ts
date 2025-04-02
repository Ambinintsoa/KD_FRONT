import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating'; // Ajout pour les étoiles
import { AvisClientService, AvisClient } from '../../service/avis-client.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-avis-valides',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, CarouselModule, RatingModule,FormsModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      <!-- Titre stylisé -->
      <h1 class="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-10 text-center tracking-tight">
        Ce que nos clients disent de nous
      </h1>

      <!-- Carousel -->
      <p-carousel 
        [value]="avisValides" 
        [numVisible]="3" 
        [numScroll]="1" 
        [circular]="true" 
        [responsiveOptions]="responsiveOptions"
        [showIndicators]="true"
        [showNavigators]="true"
        [autoplayInterval]="5000"
        class="custom-carousel"
      >
        <ng-template let-avis pTemplate="item">
          <div class="p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <!-- Header avec une icône et le nom -->
              <div class="flex items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-4">
                  <span class="text-indigo-600 dark:text-indigo-300 text-xl font-semibold">
                    {{ avis.client?.nom?.charAt(0) || 'A' }}
                  </span>
                </div>
                <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {{ avis.client?.nom || 'Client anonyme' }}
                </h2>
              </div>

              <!-- Contenu -->
              <div class="p-6">
                <!-- Étoiles pour le score -->
                <div *ngIf="avis.score" class="mb-4">
                  <p-rating 
                  [(ngModel)]="avis.score" 
                    [readonly]="true" 
                    [stars]="5" 
                    class="text-yellow-400"
                  />
                </div>
                <!-- Commentaire -->
                <p class="text-gray-600 dark:text-gray-300 italic text-base leading-relaxed">
                  "{{ avis.avis }}"
                </p>
                <!-- Mécanicien et Date -->
                <p *ngIf="avis.mecanicien" class="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <strong>Mécanicien :</strong> {{ avis.mecanicien.nom || 'Non spécifié' }}
                </p>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <strong>Date :</strong> {{ avis.date | date:'dd MMMM yyyy' }}
                </p>
              </div>
            </div>
          </div>
        </ng-template>
      </p-carousel>

      <!-- Message si aucun avis -->
      <div *ngIf="avisValides.length === 0" class="text-center mt-12">
        <p class="text-gray-500 dark:text-gray-400 text-lg">
          Aucun avis validé disponible pour le moment.
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

      :host ::ng-deep .p-rating .p-rating-icon {
        @apply text-yellow-400 text-lg;
      }
    </style>
  `
})
export class AvisValidesComponent implements OnInit {
  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 1 },
    { breakpoint: '768px', numVisible: 2, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ];
  avisValides: AvisClient[] = [];

  constructor(private avisClientService: AvisClientService) {}

  ngOnInit() {
    this.loadAvisValides();
  }

  loadAvisValides() {
    this.avisClientService.getValidatedAvisRandom().subscribe({
      next: (response: any) => {
        this.avisValides = response.avis || [];
      },
      error: (err) => {
        console.error('Erreur lors du chargement des avis validés:', err);
      }
    });
  }
}