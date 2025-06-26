import { Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { UrlList } from './components/url-list/url-list';

export const routes: Routes = [
    { path: 'url-list', component: UrlList },
    { path: '', component: UrlList },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
