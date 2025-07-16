import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Menu } from './pages/menu/menu';
import { Order } from './pages/order/order';
import { Profile } from './pages/profile/profile';
import { AuthPage } from './pages/auth/auth-page/auth-page.component';

export const routes: Routes = [
    { path: '', component: Menu },
    { path: 'about', component: About },
    { path: 'order', component: Order },
    { path: 'profile', component: Profile },
    { path: 'auth', component: AuthPage },
    { path: '**', redirectTo: '' }
    
];
