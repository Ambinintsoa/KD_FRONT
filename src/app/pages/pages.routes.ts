import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Category } from './crud/category';
import { Service } from './crud/service';
import { Produit } from './crud/produit';
import { Utilisateur } from './crud/utilisateur';
export default [
    { path: 'crud', component: Crud },
    { path: 'category', component: Category },
    { path: 'service', component: Service },
    { path: 'produit', component: Produit },
    { path: 'utilisateur', component: Utilisateur },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
