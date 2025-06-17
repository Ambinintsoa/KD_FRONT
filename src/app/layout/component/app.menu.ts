import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth/auth.service'; // Assurez-vous d'avoir ce service d'authentification
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    constructor(private authService: AuthService) {}

    ngOnInit() {
        // Vérification du rôle admin
        const isAdmin = this.authService.isAdmin(); // Cette méthode retournera true si l'utilisateur est un admin
        const isPersonal = this.authService.isPersonal(); // Cette méthode retournera true si l'utilisateur est un admin
        const isMecanicien =this.authService.isMecanicien();
        const isClient =this.authService.isClient();

        // Définition du modèle du menu
        this.model = [
            ...(isAdmin ? [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
        ] : []),
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    ...(isPersonal ? [ 
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    }]:[]),
                    ...(isPersonal ? [  {
                        label: 'Stock',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/pages/stock']
                    }]:[]),
                    // Filtrage du menu "Paramétrages" selon le rôle
                    ...(isAdmin ? [
                        {
                            label: 'Paramétrages',
                            icon: 'pi pi-fw pi-pencil',
                            items: [
                                {
                                    label: 'Catégories',
                                    icon: 'pi pi-fw pi-objects-column',
                                    routerLink: ['/pages/category']
                                },
                                {
                                    label: 'Marques',
                                    icon: 'pi pi-fw pi-objects-column',
                                    routerLink: ['/pages/marque']
                                },
                                  {
                                    label: 'Services',
                                    icon: 'pi pi-fw pi-objects-column',
                                    routerLink: ['/pages/service']
                                },
                                {
                                    label: 'Produits',
                                    icon: 'pi pi-fw pi-objects-column',
                                    routerLink: ['/pages/produit']
                                },
                                {
                                    label: 'Avis Client',
                                    icon: 'pi pi-fw pi-objects-column',
                                    routerLink: ['/pages/avis']
                                },
                                {
                                    label: 'Utilisateurs',
                                    icon: 'pi pi-fw pi-objects-column',
                                    routerLink: ['/pages/utilisateur']
                                },
                                {
                                    label: 'Factures',
                                    icon: 'pi pi-fw pi-receipt',
                                    routerLink: ['/pages/facture']
                                },
                               
                            ]
                        }, {
                            label: 'Rendez vous',
                            icon: 'pi pi-fw pi-clock',
                            items:[
                                {
                                    label: 'Vue sur les rendez Vous',
                                    icon: 'pi pi-calendar',
                                    routerLink: ['/pages/calendrier_manager']
                                },
                                {
                                    label: 'Demande de rendez Vous',
                                    icon: 'pi pi-bell',
                                    routerLink: ['/pages/liste_rdv_manager']
                                },
                                {
                                    label: 'Historique de services',
                                    icon: 'pi pi-book',
                                    routerLink: ['/pages/historique_service']
                                },
                            ]}
                    ] : []),
                     
                            ...( isClient? [
                                {
                                    label: 'Rendez vous',
                                    icon: 'pi pi-fw pi-clock',
                                    items:[
                                        {
                                            label: 'Liste des rendez Vous',
                                            icon: 'pi pi-calendar',
                                            routerLink: ['/pages/calendrier_client']
                                        },
                                        {
                                            label: 'Historique de services',
                                            icon: 'pi pi-book',
                                            routerLink: ['/pages/historique_service']
                                        },
                                    ]}]:[]),
                                    ...( isMecanicien? [
                                        {
                                            label: 'Rendez vous',
                                            icon: 'pi pi-fw pi-clock',
                                            items:[
                                                {
                                                    label: 'Emploi du temps',
                                                    icon: 'pi pi-calendar',
                                                    routerLink: ['/pages/calendrier_mecanicien']
                                                },
                                                {
                                                    label: 'Liste des rendez-vous',
                                                    icon: 'pi pi-book',
                                                    routerLink: ['/pages/taches']
                                                },
                                            ]}]:[]),
                                     // Ne pas inclure "Paramétrages" si l'utilisateur n'est pas admin
                    {
                        label: 'Calendrier',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/calendrier']
                    },
                    ...(isAdmin ? [
                    {
                        label: 'Factures Client',
                        icon: 'pi pi-fw pi-receipt',
                        routerLink: ['/pages/factureClient']
                    }]:[]),
                ]
            }
        ];
    }
}
