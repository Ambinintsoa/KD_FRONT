import { Service } from "./../../crud/service";
import { Component, inject, OnInit } from "@angular/core";
import { StyleClassModule } from "primeng/styleclass";
import { Router, RouterModule } from "@angular/router";
import { RippleModule } from "primeng/ripple";
import { ButtonModule } from "primeng/button";
import { MegaMenuModule } from "primeng/megamenu";
import { DrawerModule } from "primeng/drawer";
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from "primeng/autocomplete";
import { NodeService } from "../../service/node.service";
import { FormsModule } from "@angular/forms";
import { MultiSelectModule } from "primeng/multiselect";
import { Country } from "../../service/customer.service";
import { TreeNode } from "primeng/api";
import { TreeSelectModule } from "primeng/treeselect";
import { CommonModule } from "@angular/common";
@Component({
  selector: "topbar-widget",
  imports: [
    MegaMenuModule,
    RouterModule,
    DrawerModule,
    StyleClassModule,
    ButtonModule,
    RippleModule,
    AutoCompleteModule,
    FormsModule,
    MultiSelectModule,
    TreeSelectModule,
    CommonModule,
  ],
  template: `<a class="flex items-center" href="#">
      <svg
        viewBox="0 0 54 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 mr-2"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M17.1637 19.2467C17.1566 19.4033 17.1529 19.561 17.1529 19.7194C17.1529 25.3503 21.7203 29.915 27.3546 29.915C32.9887 29.915 37.5561 25.3503 37.5561 19.7194C37.5561 19.5572 37.5524 19.3959 37.5449 19.2355C38.5617 19.0801 39.5759 18.9013 40.5867 18.6994L40.6926 18.6782C40.7191 19.0218 40.7326 19.369 40.7326 19.7194C40.7326 27.1036 34.743 33.0896 27.3546 33.0896C19.966 33.0896 13.9765 27.1036 13.9765 19.7194C13.9765 19.374 13.9896 19.0316 14.0154 18.6927L14.0486 18.6994C15.0837 18.9062 16.1223 19.0886 17.1637 19.2467ZM33.3284 11.4538C31.6493 10.2396 29.5855 9.52381 27.3546 9.52381C25.1195 9.52381 23.0524 10.2421 21.3717 11.4603C20.0078 11.3232 18.6475 11.1387 17.2933 10.907C19.7453 8.11308 23.3438 6.34921 27.3546 6.34921C31.36 6.34921 34.9543 8.10844 37.4061 10.896C36.0521 11.1292 34.692 11.3152 33.3284 11.4538ZM43.826 18.0518C43.881 18.6003 43.9091 19.1566 43.9091 19.7194C43.9091 28.8568 36.4973 36.2642 27.3546 36.2642C18.2117 36.2642 10.8 28.8568 10.8 19.7194C10.8 19.1615 10.8276 18.61 10.8816 18.0663L7.75383 17.4411C7.66775 18.1886 7.62354 18.9488 7.62354 19.7194C7.62354 30.6102 16.4574 39.4388 27.3546 39.4388C38.2517 39.4388 47.0855 30.6102 47.0855 19.7194C47.0855 18.9439 47.0407 18.1789 46.9536 17.4267L43.826 18.0518ZM44.2613 9.54743L40.9084 10.2176C37.9134 5.95821 32.9593 3.1746 27.3546 3.1746C21.7442 3.1746 16.7856 5.96385 13.7915 10.2305L10.4399 9.56057C13.892 3.83178 20.1756 0 27.3546 0C34.5281 0 40.8075 3.82591 44.2613 9.54743Z"
          fill="var(--primary-color)"
        />
        <mask
          id="mask0_1413_1551"
          style="mask-type: alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="8"
          width="54"
          height="11"
        >
          <path
            d="M27 18.3652C10.5114 19.1944 0 8.88892 0 8.88892C0 8.88892 16.5176 14.5866 27 14.5866C37.4824 14.5866 54 8.88892 54 8.88892C54 8.88892 43.4886 17.5361 27 18.3652Z"
            fill="var(--primary-color)"
          />
        </mask>
        <g mask="url(#mask0_1413_1551)">
          <path
            d="M-4.673e-05 8.88887L3.73084 -1.91434L-8.00806 17.0473L-4.673e-05 8.88887ZM27 18.3652L26.4253 6.95109L27 18.3652ZM54 8.88887L61.2673 17.7127L50.2691 -1.91434L54 8.88887ZM-4.673e-05 8.88887C-8.00806 17.0473 -8.00469 17.0505 -8.00132 17.0538C-8.00018 17.055 -7.99675 17.0583 -7.9944 17.0607C-7.98963 17.0653 -7.98474 17.0701 -7.97966 17.075C-7.96949 17.0849 -7.95863 17.0955 -7.94707 17.1066C-7.92401 17.129 -7.89809 17.1539 -7.86944 17.1812C-7.8122 17.236 -7.74377 17.3005 -7.66436 17.3743C-7.50567 17.5218 -7.30269 17.7063 -7.05645 17.9221C-6.56467 18.3532 -5.89662 18.9125 -5.06089 19.5534C-3.39603 20.83 -1.02575 22.4605 1.98012 24.0457C7.97874 27.2091 16.7723 30.3226 27.5746 29.7793L26.4253 6.95109C20.7391 7.23699 16.0326 5.61231 12.6534 3.83024C10.9703 2.94267 9.68222 2.04866 8.86091 1.41888C8.45356 1.10653 8.17155 0.867278 8.0241 0.738027C7.95072 0.673671 7.91178 0.637576 7.90841 0.634492C7.90682 0.63298 7.91419 0.639805 7.93071 0.65557C7.93897 0.663455 7.94952 0.673589 7.96235 0.686039C7.96883 0.692262 7.97582 0.699075 7.98338 0.706471C7.98719 0.710167 7.99113 0.714014 7.99526 0.718014C7.99729 0.720008 8.00047 0.723119 8.00148 0.724116C8.00466 0.727265 8.00796 0.730446 -4.673e-05 8.88887ZM27.5746 29.7793C37.6904 29.2706 45.9416 26.3684 51.6602 23.6054C54.5296 22.2191 56.8064 20.8465 58.4186 19.7784C59.2265 19.2431 59.873 18.7805 60.3494 18.4257C60.5878 18.2482 60.7841 18.0971 60.9374 17.977C61.014 17.9169 61.0799 17.8645 61.1349 17.8203C61.1624 17.7981 61.1872 17.7781 61.2093 17.7602C61.2203 17.7512 61.2307 17.7427 61.2403 17.7348C61.2452 17.7308 61.2499 17.727 61.2544 17.7233C61.2566 17.7215 61.2598 17.7188 61.261 17.7179C61.2642 17.7153 61.2673 17.7127 54 8.88887C46.7326 0.0650536 46.7357 0.0625219 46.7387 0.0600241C46.7397 0.0592345 46.7427 0.0567658 46.7446 0.0551857C46.7485 0.0520238 46.7521 0.0489887 46.7557 0.0460799C46.7628 0.0402623 46.7694 0.0349487 46.7753 0.0301318C46.7871 0.0204986 46.7966 0.0128495 46.8037 0.00712562C46.818 -0.00431848 46.8228 -0.00808311 46.8184 -0.00463784C46.8096 0.00228345 46.764 0.0378652 46.6828 0.0983779C46.5199 0.219675 46.2165 0.439161 45.7812 0.727519C44.9072 1.30663 43.5257 2.14765 41.7061 3.02677C38.0469 4.79468 32.7981 6.63058 26.4253 6.95109L27.5746 29.7793ZM54 8.88887C50.2691 -1.91433 50.27 -1.91467 50.271 -1.91498C50.2712 -1.91506 50.272 -1.91535 50.2724 -1.9155C50.2733 -1.91581 50.274 -1.91602 50.2743 -1.91616C50.2752 -1.91643 50.275 -1.91636 50.2738 -1.91595C50.2714 -1.91515 50.2652 -1.91302 50.2552 -1.9096C50.2351 -1.90276 50.1999 -1.89078 50.1503 -1.874C50.0509 -1.84043 49.8938 -1.78773 49.6844 -1.71863C49.2652 -1.58031 48.6387 -1.377 47.8481 -1.13035C46.2609 -0.635237 44.0427 0.0249875 41.5325 0.6823C36.215 2.07471 30.6736 3.15796 27 3.15796V26.0151C33.8087 26.0151 41.7672 24.2495 47.3292 22.7931C50.2586 22.026 52.825 21.2618 54.6625 20.6886C55.5842 20.4011 56.33 20.1593 56.8551 19.986C57.1178 19.8993 57.3258 19.8296 57.4735 19.7797C57.5474 19.7548 57.6062 19.7348 57.6493 19.72C57.6709 19.7127 57.6885 19.7066 57.7021 19.7019C57.7089 19.6996 57.7147 19.6976 57.7195 19.696C57.7219 19.6952 57.7241 19.6944 57.726 19.6938C57.7269 19.6934 57.7281 19.693 57.7286 19.6929C57.7298 19.6924 57.7309 19.692 54 8.88887ZM27 3.15796C23.3263 3.15796 17.7849 2.07471 12.4674 0.6823C9.95717 0.0249875 7.73904 -0.635237 6.15184 -1.13035C5.36118 -1.377 4.73467 -1.58031 4.3155 -1.71863C4.10609 -1.78773 3.94899 -1.84043 3.84961 -1.874C3.79994 -1.89078 3.76474 -1.90276 3.74471 -1.9096C3.73469 -1.91302 3.72848 -1.91515 3.72613 -1.91595C3.72496 -1.91636 3.72476 -1.91643 3.72554 -1.91616C3.72593 -1.91602 3.72657 -1.91581 3.72745 -1.9155C3.72789 -1.91535 3.72874 -1.91506 3.72896 -1.91498C3.72987 -1.91467 3.73084 -1.91433 -4.673e-05 8.88887C-3.73093 19.692 -3.72983 19.6924 -3.72868 19.6929C-3.72821 19.693 -3.72698 19.6934 -3.72603 19.6938C-3.72415 19.6944 -3.72201 19.6952 -3.71961 19.696C-3.71482 19.6976 -3.70901 19.6996 -3.7022 19.7019C-3.68858 19.7066 -3.67095 19.7127 -3.6494 19.72C-3.60629 19.7348 -3.54745 19.7548 -3.47359 19.7797C-3.32589 19.8296 -3.11788 19.8993 -2.85516 19.986C-2.33008 20.1593 -1.58425 20.4011 -0.662589 20.6886C1.17485 21.2618 3.74125 22.026 6.67073 22.7931C12.2327 24.2495 20.1913 26.0151 27 26.0151V3.15796Z"
            fill="var(--primary-color)"
          />
        </g>
      </svg>
      <span
        class="text-surface-900 dark:text-surface-0 font-medium text-sm leading-normal mr-20"
        >m1p12mean-Fy-Isabelle</span
      >
    </a>

    <a
      pButton
      [text]="true"
      severity="secondary"
      [rounded]="true"
      pRipple
      class="lg:!hidden"
      pStyleClass="@next"
      enterClass="hidden"
      leaveToClass="hidden"
      [hideOnOutsideClick]="true"
    >
      <i class="pi pi-bars !text-2xl"></i>
    </a>

    <div
      class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border"
    >
      <p-megamenu [model]="megaMenuItems" ng-i />
      <p-drawer
        [(visible)]="visible"
        header="Devis"
        position="right"
        [style]="{ width: '400px' }"
      >
        <div class="p-4 flex flex-col gap-6">
          <!-- Section Voiture -->
          <div class="flex flex-col gap-2">
            <label class="font-semibold text-xl text-gray-700">Voiture</label>
            <p-treeselect
              [(ngModel)]="selectedNode"
              [options]="treeSelectNodes"
              placeholder="Sélectionner un service"
              [style]="{ width: '100%' }"
              class="w-full"
            />
          </div>
          <!-- Section Services -->
          <div class="flex flex-col gap-2">
            <label class="font-semibold text-xl text-gray-700">Services</label>
            <p-autocomplete
              [(ngModel)]="selectedAutoValue"
              [suggestions]="autoFilteredValue"
              optionLabel="name"
              placeholder="Rechercher..."
              dropdown
              multiple
              display="chip"
              (completeMethod)="filterCountry($event)"
              [style]="{ width: '100%' }"
              class="w-full"
            />
          </div>

          <!-- Bouton Calculer -->
          <div class="flex justify-end">
            <button
              pButton
              label="Calculer"
              icon="pi pi-calculator"
              class="p-button-success"
              (click)="calculate()"
            ></button>
          </div>

          <!-- Section Facture (affichée après calcul) -->
          <div
            *ngIf="showInvoice"
            class="mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-md"
          >
            <!-- En-tête de la facture -->
            <div class="border-b border-gray-300 pb-2 mb-4">
              <h3 class="text-xl font-bold text-gray-800">Facture</h3>
              <p class="text-sm text-gray-500">
                Générée le {{ today | date: "dd/MM/yyyy" }}
              </p>
            </div>

            <!-- Tableau des éléments -->
            <table class="w-full text-sm text-gray-700">
              <thead>
                <tr class="bg-gray-100 border-b border-gray-300">
                  <th class="py-2 px-3 text-left font-semibold">Description</th>
                  <th class="py-2 px-3 text-right font-semibold">Détails</th>
                </tr>
              </thead>
              <tbody>
                <!-- Ligne pour la voiture -->
                <tr *ngIf="selectedNode" class="border-b border-gray-200">
                  <td class="py-2 px-3">Voiture sélectionnée</td>
                  <td class="py-2 px-3 text-right">{{ selectedNode.label }}</td>
                </tr>
                <!-- Ligne pour les services -->
                <tr
                  *ngIf="selectedAutoValue?.length > 0"
                  class="border-b border-gray-200"
                >
                  <td class="py-2 px-3">Services sélectionnés</td>
                  <td class="py-2 px-3 text-right">
                    <span
                      *ngFor="let country of selectedAutoValue; let last = last"
                    >
                      {{ country.name }}{{ last ? "" : ", " }}
                    </span>
                  </td>
                </tr>

                <!-- Message si rien n'est sélectionné -->
                <tr *ngIf="!selectedAutoValue?.length && !selectedNode">
                  <td
                    colspan="2"
                    class="py-2 px-3 text-center text-gray-500 italic"
                  >
                    Aucun élément sélectionné
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="border-t border-gray-300 bg-gray-50">
                  <td class="py-3 px-3 font-bold text-gray-800">Total</td>
                  <td class="py-3 px-3 text-right font-bold text-gray-800">
                    {{
                      (selectedAutoValue?.length || 0) * 10 +
                        (selectedNode ? 50 : 0)
                    }}
                    €
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </p-drawer>
      <div
        class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2"
      >
        <button
          pButton
          pRipple
          label="Connexion"
          routerLink="/auth/login"
          [rounded]="true"
          [text]="true"
        ></button>
        <button
          pButton
          pRipple
          label="Création de compte"
          routerLink="/auth/register"
          [rounded]="true"
        ></button>
      </div>
    </div> `,
  providers: [ NodeService],
})
export class TopbarWidget implements OnInit {
  showInvoice: boolean = false;
  today: Date = new Date();
  calculate() {
    this.showInvoice = true; // Affiche la facture
    console.log("Facture générée :", {
      selectedCountries: this.selectedAutoValue,
      selectedService: this.selectedNode,
    });
  }
  multiselectCountries: Country[] = [
    { name: "Australia", code: "AU" },
    { name: "Brazil", code: "BR" },
    { name: "China", code: "CN" },
    { name: "Egypt", code: "EG" },
    { name: "France", code: "FR" },
    { name: "Germany", code: "DE" },
    { name: "India", code: "IN" },
    { name: "Japan", code: "JP" },
    { name: "Spain", code: "ES" },
    { name: "United States", code: "US" },
  ];
  treeSelectNodes!: TreeNode[];

  selectedNode: any = null;
  selectedAutoValue: any = null;
  autoFilteredValue: any[] = [];

  nodeService = inject(NodeService);
  autoValue: any[] | undefined;
  ngOnInit() {
    this.nodeService.getFiles().then((data) => (this.treeSelectNodes = data));
  }
  filterCountry(event: AutoCompleteCompleteEvent) {
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < (this.autoValue as any[]).length; i++) {
      const country = (this.autoValue as any[])[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.autoFilteredValue = filtered;
  }
  megaMenuItems = [
    {
      label: "Accueil",
      icon: "pi pi-fw pi-home",
    },
    {
      label: "Devis",
      icon: "pi pi-fw pi-dollar",
      command: () => this.showDrawer(),
    },
    {
      label: "Services",
      icon: "pi pi-fw pi-cog",
      items: [
        [
          {
            label: "Computer",
            items: [{ label: "Computer Item" }, { label: "Computer Item" }],
          },
          {
            label: "Camcorder",
            items: [
              { label: "Camcorder Item" },
              { label: "Camcorder Item" },
              { label: "Camcorder Item" },
            ],
          },
        ],
        [
          {
            label: "TV",
            items: [{ label: "TV Item" }, { label: "TV Item" }],
          },
          {
            label: "Audio",
            items: [
              { label: "Audio Item" },
              { label: "Audio Item" },
              { label: "Audio Item" },
            ],
          },
        ],
        [
          {
            label: "Sports.7",
            items: [{ label: "Sports.7.1" }, { label: "Sports.7.2" }],
          },
        ],
      ],
    },
    {
      label: "Voiture de location",
      icon: "pi pi-fw pi-car",
      items: [
        [
          {
            label: "Basketball",
            items: [{ label: "Basketball Item" }, { label: "Basketball Item" }],
          },
          {
            label: "Football",
            items: [
              { label: "Football Item" },
              { label: "Football Item" },
              { label: "Football Item" },
            ],
          },
        ],
        [
          {
            label: "Tennis",
            items: [{ label: "Tennis Item" }, { label: "Tennis Item" }],
          },
        ],
      ],
    },
  ];
  visible: boolean = false; // Contrôle la visibilité du drawer

  showDrawer() {
    this.visible = true; // Ouvre le drawer
  }

  hideDrawer() {
    this.visible = false; // Ferme le drawer
  }
  constructor(public router: Router) {}
}
