import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Category } from "./crud/category";
import { Service } from './crud/service';
import { Produit } from './crud/produit';
import { Utilisateur } from './crud/utilisateur';
import { CalendarComponent } from './uikit/calendar';
import { authGuard } from '../auth/auth.guard';
export default [
    { path: 'crud', component: Crud, canActivate: [authGuard],
        data: { profile: 'admin' }},
    { path: 'category', component: Category },
    { path: 'service', component: Service },
    { path: 'produit', component: Produit },
    { path: 'utilisateur', component: Utilisateur },
    { path: 'calendrier', component: CalendarComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
