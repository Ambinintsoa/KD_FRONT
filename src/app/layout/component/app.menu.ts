import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../auth/auth.service'; // Assurez-vous d'avoir ce service d'authentification

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

        // Définition du modèle du menu
        this.model = [
            ...(isAdmin ? [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
        ] : []),
            {
                label: 'UI Components',
                items: [
                    { label: 'Espace client', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
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
                                    icon: 'pi pi-fw pi-sign-in',
                                    routerLink: ['/pages/category']
                                },  {
                                    label: 'Services',
                                    icon: 'pi pi-fw pi-sign-in',
                                    routerLink: ['/pages/service']
                                },
                                {
                                    label: 'Produits',
                                    icon: 'pi pi-fw pi-sign-in',
                                    routerLink: ['/pages/produit']
                                },
                                {
                                    label: 'Avis Client',
                                    icon: 'pi pi-fw pi-sign-in',
                                    routerLink: ['/pages/avis']
                                },
                                {
                                    label: 'Utilisateurs',
                                    icon: 'pi pi-fw pi-sign-in',
                                    routerLink: ['/pages/utilisateur']
                                },
                            ]
                        }
                    ] : []),  // Ne pas inclure "Paramétrages" si l'utilisateur n'est pas admin
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/notfound']
                    },
                    {
                        label: 'Calendrier',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/calendrier']
                    }
                ]
            }
        ];
    }
}
