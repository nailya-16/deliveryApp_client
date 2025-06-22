import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { PizzaService } from '../../services/pizza.service';
import { CommonModule } from '@angular/common';
import { Pizza } from '../../models/pizza';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.html',
  styleUrl: './order.scss'
})
export class Order implements OnInit{
  pizzas: Pizza[] = [];
  cart: { [id: string]: number } = {};
  total: number = 0;

  constructor(private cartService: CartService, private pizzaService: PizzaService){}

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.pizzaService.getPizzas().subscribe(pizzas => {
      this.pizzas = pizzas;
      this.calculateTotal();
    });
  }

  getCartIds(){
    return Object.keys(this.cart);
  }

  getPizzaById(id: string | number) {
    return this.pizzas.find(p => p.id === +id);
  }

  getPizzaName(id: string | number) {
    return this.getPizzaById(id)?.name || '';
  }

  getPizzaPrice(id: string | number) {
    return this.getPizzaById(id)?.price || 0;
  }

  calculateTotal() {
    this.total = this.getCartIds().reduce((sum, id) => {
      const pizza = this.getPizzaById(id);
      return pizza ? sum + pizza.price * this.cart[id] : sum;
    }, 0);
  }

  remove(pizzaId: number) {
    this.cartService.remove(pizzaId);
    this.cart = this.cartService.getCart();
    this.calculateTotal();
  }

  clearCart() {
    this.cartService.clear();
    this.cart = {};
    this.total = 0;
  }
}
