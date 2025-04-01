import { CommonModule } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { MessageService } from "primeng/api";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from 'primeng/checkbox'; // Import p-checkbox
import { DrawerModule } from "primeng/drawer";
import { DropdownModule } from 'primeng/dropdown'; // Import du module Dropdown
import { MegaMenuModule } from "primeng/megamenu";
import { MultiSelectModule } from "primeng/multiselect";
import { RippleModule } from "primeng/ripple";
import { SelectButtonModule } from "primeng/selectbutton";
import { StyleClassModule } from "primeng/styleclass";
import { TreeSelectModule } from "primeng/treeselect";
import { CategorieVoitureResponse, CategorievoitureService } from '../../../../service/categorievoiture.service';
import { CategoryService } from "../../../../service/category.service ";
import { DevisService } from "../../../../service/devis.service";
import { MarqueResponse, MarqueService } from '../../../../service/marque.service';
import { ServiceCategoriesObject, ServiceService } from "../../../../service/service.service";

export class AppModule {}

@Component({
  selector: 'topbarwidget',
  imports: [CommonModule,
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
    DropdownModule, // Import du module Dropdown
    // BrowserAnimationsModule, // Obligatoire pour les animations PrimeNG,
    SelectButtonModule,
    CheckboxModule
  ],
  templateUrl: './topbarwidget.component.html',
  styleUrl: './topbarwidget.component.scss',
  providers: [MessageService, ServiceService]
})
export class TopbarwidgetComponent implements OnInit {

  showInvoice: boolean = false;
  isForm: boolean = true;

  today: Date = new Date();
  voiture_immatriculation: string = '';
  voiture_kilometrage: number = 0;

  voiture_marque: string = '';
  voiture_categorie: string = '';

  liste_marques: { label: string, value: string }[] = [];
  liste_categories: { label: string, value: string }[] = [];
  liste_services: { service: string; nom_service: string, avec_produit: boolean }[] = [];

  // service_object:ServiceObject={};
  // categorie_service:CategoryObject={};
  liste_categorie_service: ServiceCategoriesObject[] =[];
  // private messageService: MessageService;
  constructor(private MarqueService: MarqueService, private CategorieVoitureService: CategorievoitureService, public router: Router, private messageService: MessageService, private service_service: ServiceService,
     private categorie_service: CategoryService, private devisService: DevisService) { }

  //ajoute un service dans la liste
  addServices(service_value: string = '', nom_service: string = '', avec_produit: boolean = false) {
      console.log(service_value);
      // const service = this.liste_services.find(value => value.service === service_value);
      
    if (!this.liste_services.some(value => value.nom_service === nom_service)) {
      this.liste_services.push({ service: service_value, nom_service: nom_service, avec_produit: avec_produit });
    }
  }
  reset_avec_produit(service_value: string) {
    const service = this.liste_services.find(value => value.service === service_value);
    console.log(this.liste_services);

    if (service) {
      service.avec_produit = !service.avec_produit;
    }
  }
  remove(service_value: string) {
    let index = this.liste_services.findIndex(service => service.service === service_value);
    if (index > -1) {
      this.liste_services.splice(index, 1);
    }
  }
  retour(){
    this.showInvoice=false;
    this.isForm=true;
  }
  //donnée a propos de la voiture
  get voiture_data() {
    return {
      immatriculation: this.voiture_immatriculation,
      kilometrage: this.voiture_kilometrage,
      marque: this.voiture_marque,
      categorie: this.voiture_categorie,
    };
  }
  //les données utilisées pour generer le nouveau devis
  get nouveau_devis() {
    return {
      voiture: this.voiture_data,
      services: this.liste_services,
    };
  }

  calculate() {
    this.showInvoice = true; // Affiche la facture
    this.isForm=false;
    this.devisService.getDevis(this.nouveau_devis, this.voiture_data)
    .subscribe(
      (response) => {
        // Handle the successful response here.
        console.log("Facture générée :", response);
        // You might want to store the response to display in the invoice.
        // this.invoiceData = response;
      },
      (error) => {
        // Handle error here.
        console.error("Erreur lors de la récupération du devis :", error);
      }
    );
  }
  onCheckboxChange(event: any, service_obj: any) {
    service_obj.checked =!service_obj.checked;  // Assure que checked garde la bonne valeur
    console.log(typeof(service_obj.checked));
    this.addServices(service_obj._id, service_obj.nom_service);
  }

  selectedNode: any = null;
  selectedAutoValue: any = null;
  autoFilteredValue: any[] = [];
  // countryService = inject(CountryService);

  // nodeService = inject(NodeService);
  autoValue: any[] | undefined;


  ngOnInit() {

    // donne la liste des categories de voitures
    this.CategorieVoitureService.getAllCategorieVoitures().subscribe({
      next: (resultat: CategorieVoitureResponse) => {
        this.liste_categories = resultat.categories.map((categorie) => {
          return {
            label: categorie.nom,
            value: categorie._id
          };
        });
      }, error: (error) => {
        console.error("Erreur lors du chargement :", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Échec du chargement des données",
          life: 3000,
        });
      },
      complete: () => {
        console.log('Requête terminée');
      }
    });

    // donne la liste des marques
    this.MarqueService.getAllMarques().subscribe({
      next: (resultat: MarqueResponse) => {
        this.liste_marques = resultat.marques.map((marque) => {
          return {
            label: marque.nom_marque,
            value: marque._id
          };
        });
      }, error: (error) => {
        console.error("Erreur lors du chargement :", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Échec du chargement des données",
          life: 3000,
        });
      },
      complete: () => {
        console.log('Requête terminée');
      }
    });

  
    this.service_service.getServiceCategories().subscribe({
      next: (resultat: ServiceCategoriesObject[]) => { 
        this.liste_categorie_service=resultat;
      },
      error: (error) => {
        console.error("Erreur lors du chargement :", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Échec du chargement des données",
          life: 3000,
        });
      },
      complete: () => {
        console.log('Requête terminée');
      }
    });
  }


  filterCountry(event: AutoCompleteModule) {
    const filtered: any[] = [];

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
      label: "Promotion",
      icon: "pi pi-fw pi-gift",
      items: [
        [
          {
            label: "Living Room",
            items: [
              { label: "Living Room Item" },
              { label: "Living Room Item" },
            ],
          },
          {
            label: "Kitchen",
            items: [
              { label: "Kitchen Item" },
              { label: "Kitchen Item" },
              { label: "Kitchen Item" },
            ],
          },
        ],
        [
          {
            label: "Bedroom",
            items: [{ label: "Bedroom Item" }, { label: "Bedroom Item" }],
          },
          {
            label: "Outdoor",
            items: [
              { label: "Outdoor Item" },
              { label: "Outdoor Item" },
              { label: "Outdoor Item" },
            ],
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
  // constructor(public router: Router) {}
}


