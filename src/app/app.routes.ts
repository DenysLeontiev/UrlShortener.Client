import { Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { UrlList } from './components/url-list/url-list';
import { UrlDetails } from './components/url-details/url-details';

export const routes: Routes = [
    { path: 'url-list/:id', component: UrlDetails },
    { path: 'url-list', component: UrlList},
    { path: '', component: UrlList },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
