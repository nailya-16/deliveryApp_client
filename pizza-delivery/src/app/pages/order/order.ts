import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { PizzaService } from '../../services/pizza.service';
import { CommonModule } from '@angular/common';
import { Pizza } from '../../models/pizza';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order.html',
  styleUrl: './order.scss'
})
export class Order implements OnInit{
  pizzas: Pizza[] = [];
  cart: { [id: string]: number } = {};
  total: number = 0;
  userName: string ='';
  userPhone: string = '';
  orderSuccess: boolean = false;
  showModal: boolean = false;

  constructor(
    private cartService: CartService, 
    private pizzaService: PizzaService,
    private http: HttpClient
  ){}

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
    return this.pizzas.find(p => p._id === id);
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

  remove(pizzaId: string) {
    this.cartService.remove(pizzaId);
    this.cart = this.cartService.getCart();
    this.calculateTotal();
  }

  clearCart() {
    this.cartService.clear();
    this.cart = {};
    this.total = 0;
  }

  openOrderModal() {
    this.showModal = true;
  }

  closeOrderModal() {
    this.showModal = false;
  }

  makeOrder() {
    const cartArray = this.getCartIds().map(id => ({
      pizzaName: this.getPizzaName(id),
      quantity: this.cart[id]
    }));

    const order = {
      customerName: this.userName,
      customerPhone: this.userPhone,
      cart: cartArray
    };
    this.http.post('http://localhost:3000/orders', order).subscribe({
      next: () => {
        this.orderSuccess = true;
        this.clearCart();
        this.closeOrderModal();
      },
      error: (err) => {
        alert('Ошибка оформления заказа!');
      }
    });
  }
}
