import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Menu } from './pages/menu/menu';
import { Order } from './pages/order/order';
import { Profile } from './pages/profile/profile';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'menu', component: Menu },
    { path: 'order', component: Order },
    { path: 'profile', component: Profile },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
];
