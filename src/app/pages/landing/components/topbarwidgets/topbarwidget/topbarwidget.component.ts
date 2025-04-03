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
import { DevisObject, DevisService } from "../../../../service/devis.service";
import { MarqueResponse, MarqueService } from '../../../../service/marque.service';
import { RendezVousService } from "../../../../service/rendez-vous-service.service";
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

  devis_object:DevisObject={ total_devis: 0, devis_details: [] };
  
  liste_categorie_service: ServiceCategoriesObject[] =[];
  showRendezVousForm:boolean=false;// pour afficher le formulaire de rendez_vous
  date_rendez_vous='';
  // private messageService: MessageService;
  constructor(private MarqueService: MarqueService, private CategorieVoitureService: CategorievoitureService, public router: Router, private messageService: MessageService, private service_service: ServiceService,
     private categorie_service: CategoryService, private devisService: DevisService,private rendez_vous_service:RendezVousService) { }

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

  clear_error(field:string) {
    let temp_error_elt = document.getElementById(field);
    if (temp_error_elt) {
        temp_error_elt.style.display = "none";
        temp_error_elt.innerHTML = "";
    }
}

validateForm() {
  let error_list: { field: string; message: string }[] = [];


    // Vérification des champs et ajout des erreurs
    if (!this.voiture_marque) {
        error_list.push({ field: "voiture_marque_error", message: "Sélectionner une marque" });
    } else {
        this.clear_error("voiture_marque_error"); // Masquer l'erreur si le champ est valide
    }

    if (!this.voiture_categorie) {
        error_list.push({ field: "voiture_categorie_error", message: "Sélectionner une catégorie" });
    } else {
        this.clear_error("voiture_categorie_error");
    }
    if (this.voiture_kilometrage<=0) {
      error_list.push({ field: "voiture_kilometrage_error", message: "Le kilometrage doit etre une valeur positive" });
  } else {
      this.clear_error("voiture_kilometrage_error");
  }

    if (!this.voiture_immatriculation) {
        error_list.push({ field: "voiture_immatriculation_error", message: "Compléter l'immatriculation de votre voiture" });
    } else if (this.voiture_immatriculation.length !==8) {
        error_list.push({ field: "voiture_immatriculation_error", message: "Le numéro d'immatriculation doit être de longueur 8 ex: TAR 4566" });
    } else {
        this.clear_error("voiture_immatriculation_error");
    }

    if (this.liste_services.length === 0) {
        error_list.push({ field: "services_error", message: "Sélectionner au moins un service" });
    } else {
        this.clear_error("services_error");
    }

    // Affichage des erreurs trouvées
    if (error_list.length > 0) {
        this.display_error(error_list);
        return false;
    }
    return true;
}

display_error(error_list: { field: string; message: string }[]) {
    for (const error of error_list) {
        let temp_error_elt = document.getElementById(error.field);
        if (temp_error_elt) {
            temp_error_elt.style.display = "block";
            temp_error_elt.style.color = "red";
            temp_error_elt.innerHTML = error.message;
        } else {
            console.warn(`L'élément avec l'ID '${error.field}' est introuvable.`);
        }
    }
}

// genere le devis si les formulaires sont ok 
  calculate() {
    if(this.validateForm()){
    this.showInvoice = true; // Affiche la facture
    this.isForm=false;
    this.devisService.getDevis(this.nouveau_devis)
    .subscribe(
      (response) => {
       this.devis_object=response.data;
      },
      (error) => {
        // Handle error here.
        console.error("Erreur lors de la récupération du devis :", error);
      }
    );
  }
}


//rendez_vous
RendezVousForm(){
  // RedirectCommand();

  //TODO : redirect to login s'il y a pas de token
                              
  //TODO : rhf mi-cocher tache => si existe produit => miala stock 
  localStorage.setItem("devis_objet",JSON.stringify(this.devis_object));
  localStorage.setItem("liste_service",JSON.stringify(this.liste_services));
  localStorage.setItem("voiture",JSON.stringify(this.voiture_data));

  if(localStorage.getItem("access_token")){ //TODO : alaina avy anay @ cookies ilay access_token
    this.showRendezVousForm=true;
  }else{
    // window.location.href='/auth/login';
    this.showRendezVousForm=true;

  }
}

convert_to_tache(liste_service:{ service: string; nom_service: string, avec_produit: boolean }[]){
  let taches:{service:string}[]=[];

  for( let service of liste_service){
    taches.push({"service":service.service});
  }
  return taches;
}
  async SaveRendezVous() {
    try {
        let liste_service = JSON.parse(localStorage.getItem("liste_service") || "[]");
        let devis_object = JSON.parse(localStorage.getItem("devis_objet") || "[]");
        let voiture = JSON.parse(localStorage.getItem("voiture") || "{}");

        if (!liste_service || liste_service.length === 0) {
            console.error("Erreur : Aucun service sélectionné.");
            return;
        }

        let liste_tache = this.convert_to_tache(liste_service);

        // Subscribe to the observable
        this.rendez_vous_service.sendRendezVousRequest(liste_tache, this.date_rendez_vous, voiture,devis_object)
            .subscribe({
                next: (response) => {
                    alert("Rendez-vous envoyé avec succès");
                    window.location.href="/landing";
                },
                error: (error) => {
                    console.error("Erreur lors de l'envoi du rendez-vous :", error);
                }
            });

    } catch (error) {
        console.error("Erreur lors de la préparation du rendez-vous :", error);
    }
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
      label: "Devis",
      icon: "pi pi-fw pi-dollar",
      command: () => this.showDrawer(),
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


