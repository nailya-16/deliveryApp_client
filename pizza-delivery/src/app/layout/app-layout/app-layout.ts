import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, MenubarModule],
  templateUrl: './app-layout.html',
  styleUrls: ['./app-layout.scss']
})
export class AppLayout {
  items: MenuItem[] = [
    { label: 'Меню', icon: 'pi pi-list', routerLink: '/menu' },
    { label: 'Заказ', icon: 'pi pi-shopping-cart', routerLink: '/order' },
    { label: 'Профиль', icon: 'pi pi-user', routerLink: '/profile' },
    { label: 'Войти', icon: 'pi pi-sign-in', routerLink: '/login' },
  ];
  
}
