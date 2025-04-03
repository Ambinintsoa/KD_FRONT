import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { Register } from './register';
import { LoginAdmin } from './loginAdmin';
import { LoginMecano } from './loginMecano';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'loginAdmin', component: LoginAdmin },
    { path: 'loginMecano', component: LoginMecano },
    { path: 'register', component: Register },
   
] as Routes;
