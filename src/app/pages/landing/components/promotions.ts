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
  template: `
<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6 text-center">Promotions en cours</h1>

  <!-- Carousel pour afficher les cards -->
  <p-carousel [value]="services" 
              [numVisible]="3" 
              [numScroll]="1" 
              [circular]="false" 
              [responsiveOptions]="responsiveOptions"
              [showIndicators]="true"
              [showNavigators]="true"
              [autoplayInterval]="3000"
              >
    <ng-template let-service pTemplate="item">
      <p-card class="shadow-lg hover:shadow-xl transition-shadow duration-300 m-2 ">
        <!-- Header avec le nom du service -->
        <ng-template pTemplate="header">
          <div class="text-white p-4 rounded-t-lg">
            <h2 class="text-xl font-semibold">{{ service.nom_service }}</h2>
          </div>
        </ng-template>

        <!-- Contenu principal -->
        <div class="p-4">
          <p><strong>Prix :</strong> {{ service.prix || 'N/A' }} Ar</p>
          <p><strong>Catégorie :</strong> {{ service.categorie_service?.nom_categorie || 'Non spécifiée' }}</p>
          
          <!-- Promotion active -->
          <div class="mt-4 p-3 bg-yellow-100 rounded-lg">
            <h3 class="text-lg font-medium text-yellow-800">Promotion active</h3>
            <p *ngIf="getPromotionActive(service) as promo; else noPromo">
              <strong>Réduction :</strong> {{ promo.pourcentage_reduction }}%<br>
              <strong>Description :</strong> {{ promo.description || 'Sans description' }}<br>
              <strong>Valide :</strong> {{ promo.date_debut | date:'dd/MM/yyyy' }} - {{ promo.date_fin | date:'dd/MM/yyyy' }}
            </p>
            <ng-template #noPromo>
              <p class="text-gray-500">Aucune promotion active</p>
            </ng-template>
          </div>
        </div>

        <!-- Footer avec un bouton -->
        <ng-template pTemplate="footer">
          <div class="p-4">
            <button pButton type="button" label="Réserver" class="p-button-warning w-full"></button>
          </div>
        </ng-template>
      </p-card>
    </ng-template>
  </p-carousel>

  <!-- Message si aucun service -->
  <div *ngIf="services.length === 0" class="text-center mt-6">
    <p class="text-gray-500">Aucune promotion disponible pour le moment.</p>
  </div>
</div>
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