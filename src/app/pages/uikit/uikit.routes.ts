import { Routes } from '@angular/router';
import { ListDemo } from './listdemo';

export default [
    { path: 'list', data: { breadcrumb: 'List' }, component: ListDemo },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
