import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Pour ngModel
import { RatingModule } from 'primeng/rating'; // Pour le score
import { SelectModule } from 'primeng/select'; // Pour le dropdown des mécaniciens
import { AvisClient, AvisClientService } from '../../service/avis-client.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'footer-widget',
  standalone: true,
  imports: [RouterModule, FormsModule, RatingModule, SelectModule,CommonModule], // Ajout des modules PrimeNG
  template: `
<footer class=" dark:bg-yellow-900 py-16 px-6 lg:px-20">
      <div class="container mx-auto">
        <div class="grid grid-cols-12 gap-8">
          <!-- Logo et titre -->
          <div class="col-span-12 md:col-span-3 flex justify-center md:justify-start">
            <a
              (click)="router.navigate(['/pages/landing'], { fragment: 'home' })"
              class="flex items-center space-x-4 cursor-pointer group"
            >
              <svg
                viewBox="0 0 54 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 text-indigo-600 dark:text-indigo-400 transition-transform duration-300 group-hover:scale-105"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.1637 19.2467C17.1566 19.4033 17.1529 19.561 17.1529 19.7194C17.1529 25.3503 21.7203 29.915 27.3546 29.915C32.9887 29.915 37.5561 25.3503 37.5561 19.7194C37.5561 19.5572 37.5524 19.3959 37.5449 19.2355C38.5617 19.0801 39.5759 18.9013 40.5867 18.6994L40.6926 18.6782C40.7191 19.0218 40.7326 19.369 40.7326 19.7194C40.7326 27.1036 34.743 33.0896 27.3546 33.0896C19.966 33.0896 13.9765 27.1036 13.9765 19.7194C13.9765 19.374 13.9896 19.0316 14.0154 18.6927L14.0486 18.6994C15.0837 18.9062 16.1223 19.0886 17.1637 19.2467ZM33.3284 11.4538C31.6493 10.2396 29.5855 9.52381 27.3546 9.52381C25.1195 9.52381 23.0524 10.2421 21.3717 11.4603C20.0078 11.3232 18.6475 11.1387 17.2933 10.907C19.7453 8.11308 23.3438 6.34921 27.3546 6.34921C31.36 6.34921 34.9543 8.10844 37.4061 10.896C36.0521 11.1292 34.692 11.3152 33.3284 11.4538ZM43.826 18.0518C43.881 18.6003 43.9091 19.1566 43.9091 19.7194C43.9091 28.8568 36.4973 36.2642 27.3546 36.2642C18.2117 36.2642 10.8 28.8568 10.8 19.7194C10.8 19.1615 10.8276 18.61 10.8816 18.0663L7.75383 17.4411C7.66775 18.1886 7.62354 18.9488 7.62354 19.7194C7.62354 30.6102 16.4574 39.4388 27.3546 39.4388C38.2517 39.4388 47.0855 30.6102 47.0855 19.7194C47.0855 18.9439 47.0407 18.1789 46.9536 17.4267L43.826 18.0518ZM44.2613 9.54743L40.9084 10.2176C37.9134 5.95821 32.9593 3.1746 27.3546 3.1746C21.7442 3.1746 16.7856 5.96385 13.7915 10.2305L10.4399 9.56057C13.892 3.83178 20.1756 0 27.3546 0C34.5281 0 40.8075 3.82591 44.2613 9.54743Z"
                  fill="currentColor"
                />
                <!-- Autres paths SVG -->
              </svg>
              <h4 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                m1p12mean-Fy-Isabelle
              </h4>
            </a>
          </div>

          <!-- Contenu principal -->
          <div class="col-span-12 md:col-span-9">
            <div class="grid grid-cols-12 gap-8">
              <!-- Section commentaire -->
              <div class="col-span-12 md:col-span-4">
                <h4 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                  Laisser un commentaire
                </h4>
                <div class="space-y-6">
                  <!-- Note -->
                  <div>
                    <label class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                      Votre note (1-5)
                    </label>
                    <p-rating 
                      [(ngModel)]="score" 
                      [stars]="5" 
                      class="text-yellow-400"
                    />
                  </div>

                  <!-- Commentaire -->
                  <div>
                    <textarea
                      [(ngModel)]="avisContent"
                      placeholder="Votre commentaire..."
                      class="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                      rows="3"
                    ></textarea>
                  </div>

                  <!-- Bouton et messages -->
                  <div>
                    <button
                      (click)="submitAvis()"
                      [disabled]="!avisContent || submitting"
                      class="w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {{ submitting ? 'Envoi...' : 'Envoyer' }}
                    </button>
                    <p *ngIf="message" class="mt-3 text-green-600 dark:text-green-400 text-sm font-medium">
                      {{ message }}
                    </p>
                    <p *ngIf="error" class="mt-3 text-red-600 dark:text-red-400 text-sm font-medium">
                      {{ error }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Autres sections (à compléter si besoin) -->
              <div class="col-span-12 md:col-span-8">
                <!-- Placeholder pour Services, Promotions, Location -->
                <div class="grid grid-cols-12 gap-8 text-center md:text-left">
                  <!-- Ajoutez ici les autres sections si nécessaire -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterWidget {
  avisContent: string = '';
  score: number | null = null; // Score pour p-rating
  submitting: boolean = false;
  message: string = '';
  error: string = '';
  


  constructor(public router: Router, private avisClientService: AvisClientService) {}

  submitAvis() {
    if (!this.avisContent.trim()) return;

    this.submitting = true;
    this.message = '';
    this.error = '';

    const avisData :Partial<AvisClient> = {
      avis: this.avisContent,
      score: this.score||0, // Score saisi par l'utilisateur
    };

    this.avisClientService.createAvis(avisData).subscribe({
      next: (response) => {
        this.submitting = false;
        this.message = 'Commentaire envoyé avec succès !';
        this.avisContent = '';
        this.score = null; // Réinitialiser le score
      },
      error: (err) => {
        this.submitting = false;
        this.error = 'Erreur lors de l’envoi du commentaire.';
        console.error(err);
      }
    });
  }
}