import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, MenubarModule,CommonModule],
  templateUrl: './app-layout.html',
  styleUrls: ['./app-layout.scss']
})
export class AppLayout implements OnInit{
  items: MenuItem[] = [];
  
  cartCount = 0;
  user: any = null;
  
  constructor(
    private cartService: CartService,
    private router: Router,
    private auth: AuthService
    ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = Object.values(cart).reduce((sum, c) => sum + c, 0);
    });

    this.auth.currentUser$.subscribe(user => {
      this.user = user;
      this.updateMenu();
    });

    this.updateMenu();
  }

   updateMenu() {
    this.items = [
      { label: 'Главная', icon: 'pi pi-home', routerLink: '/' },
      { label: 'О нас', icon: 'pi pi-info-circle', routerLink: '/about' },
    ];

    if (this.user) {
      // Если пользователь вошёл, показываем ник
      this.items.push({
        label: this.user.name,
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/profile'])
      });
    } else {
      // Если не вошёл, показываем "Войти"
      this.items.push({
        label: 'Войти',
        icon: 'pi pi-sign-in',
        command: () => this.router.navigate(['/auth'])
      });
    }
  }

  goToOrder() {
    this.router.navigate(['/order']);
  }
}
