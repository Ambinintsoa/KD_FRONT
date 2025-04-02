import { Routes } from '@angular/router';
import { Category } from "./crud/category";
import { Service } from './crud/service';
import { Produit } from './crud/produit';
import { Utilisateur } from './crud/utilisateur';
import { CalendarComponent } from './uikit/calendar';
import { authGuard } from '../auth/auth.guard';
import { StockManagement } from './crud/StockManagement';
export default [
    { path: 'category', component: Category , canActivate: [authGuard], data: { profile: 'admin' }},
    { path: 'service', component: Service , canActivate: [authGuard], data: { profile: 'admin' }},
    { path: 'produit', component: Produit , canActivate: [authGuard], data: { profile: 'admin' }},
    { path: 'utilisateur', component: Utilisateur , canActivate: [authGuard], data: { profile: 'admin' }},
    { path: 'calendrier', component: CalendarComponent },
    {path:'stock', canActivate: [authGuard], component:StockManagement},
    { path: '**', redirectTo: '/notfound' }
] as Routes;
