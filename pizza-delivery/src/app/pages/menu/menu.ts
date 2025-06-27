import { Component, OnInit } from '@angular/core';
import { Pizza } from '../../models/pizza';
import { PizzaService } from '../../services/pizza.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu implements OnInit {
  pizzas: Pizza[] = [];
  filteredPizzas: Pizza[] = [];
  loading = true;
  error = '';
  allowedIngredients: string[] = ['курица', 'грибы', 'креветки', 'ветчина', 'пепперони'];
  selectedIngredient: string = '';
  cart: { [pizzaId: string]: number } = {};

  constructor(private pizzaService: PizzaService, private cartService: CartService  ) {}

  ngOnInit(): void {
    this.pizzaService.getPizzas().subscribe({
      next: (data) => {
        this.pizzas = data;
        this.applyIngredientFilter('');
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Ошибка загрузки меню';
        this.loading = false;
      }
      
    });
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  applyIngredientFilter(ingredient: string) {
    this.selectedIngredient = ingredient;
    if (ingredient) {
      this.filteredPizzas = this.pizzas.filter(pizza =>
        pizza.description.toLowerCase().includes(ingredient.toLowerCase())
      );
    } else {
      this.filteredPizzas = this.pizzas;
    }
  }

  addToCart(pizzaId: string) {
    console.log('addToCart id:', pizzaId, typeof pizzaId)
    this.cartService.add(pizzaId);
  }

  removeFromCart(pizzaId: string) {
    this.cartService.remove(pizzaId);
  }

  getCartCount(pizzaId: string): number {
    return this.cart[pizzaId] || 0;
  }

  get totalPrice(): number {
    return Object.entries(this.cart).reduce((sum, [id, count]) => {
      const pizza = this.pizzas.find(p => p._id === id);
      return pizza ? sum + pizza.price * count : sum;
    }, 0);
  }

  get totalCount(): number {
    return Object.values(this.cart).reduce((sum, c) => sum + c, 0);
  }
}
