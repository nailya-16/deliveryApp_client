import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, MenubarModule,CommonModule],
  templateUrl: './app-layout.html',
  styleUrls: ['./app-layout.scss']
})
export class AppLayout implements OnInit{
  items: MenuItem[] = [
    { label: 'Меню', icon: 'pi pi-list', routerLink: '/menu' },
    { label: 'Профиль', icon: 'pi pi-user', routerLink: '/profile' },
    { label: 'Войти', icon: 'pi pi-sign-in', routerLink: '/login' },
  ];
  
  cartCount = 0;
  
  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = Object.values(cart).reduce((sum, c) => sum + c, 0);
    });
  }

  goToOrder() {
    this.router.navigate(['/order']);
  }
}
