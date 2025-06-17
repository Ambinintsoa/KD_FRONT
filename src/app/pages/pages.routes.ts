import { Routes } from '@angular/router';
import { authGuard } from '../auth/auth.guard';
import { AvisClientComponent } from './crud/AvisClient';
import { StockManagement } from './crud/StockManagement';
import { Category } from "./crud/category";
import { FactureComponent } from './crud/facture-list';
import { FactureClientComponent } from './crud/facture-list-client';
import { Produit } from './crud/produit';
import { Service } from './crud/service';
import { UtilisateurCrudComponent } from './crud/utilisateur';
import { ClientRendezVousComponent } from './rendez_vous/client-rendez-vous/client-rendez-vous.component';
import { ManagerRendezVousComponent } from './rendez_vous/manager-rendez-vous/manager-rendez-vous.component';
import { MecanicienRendezVousComponent } from './rendez_vous/mecanicien-rendez-vous/mecanicien-rendez-vous.component';
import { RDVManager } from './rendez_vous/rendez_vous_list/RDVManager';
import { CalendarComponent } from './uikit/calendar';
import { Marque } from './crud/marque';
import { HistoriqueServiceComponent } from './historique_service/historique_service';

export default [
    { path: 'category', component: Category , canActivate: [authGuard], data: { profile: 'admin' }},
    { path: 'marque', component: Marque , canActivate: [authGuard], data: { profile: 'admin' }},
    { path: 'service', component: Service , canActivate: [authGuard], data: { profile: 'admin' }},
    { path: 'produit', component: Produit , canActivate: [authGuard], data: { profile: 'admin' }},
    { path: 'utilisateur', component: UtilisateurCrudComponent , canActivate: [authGuard], data: { profile: 'admin' }},
    { path: 'avis', component: AvisClientComponent , canActivate: [authGuard], data: { profile: 'admin' }},
    { path: 'facture', component: FactureComponent , canActivate: [authGuard], data: { profile: 'admin' }},
    { path: 'factureClient', component: FactureClientComponent , canActivate: [authGuard]},
    { path: 'calendrier', component: CalendarComponent },
    {path:'stock', canActivate: [authGuard], component:StockManagement},
    { path: 'calendrier_manager', component:  ManagerRendezVousComponent,data:{profile:'admin'} },
    { path: 'calendrier_client', component:  ClientRendezVousComponent,data:{profile:'client'} },
    { path: 'calendrier_mecanicien', component:  MecanicienRendezVousComponent,data:{profile:'mecanicien'} },
    { path: 'liste_rdv_manager', component:  RDVManager,data:{profile:'admin'} },
    {path:'historique_service',component:HistoriqueServiceComponent,data:{profile:'client'}},
    
    { path: '**', redirectTo: '/notfound' },
] as Routes;
