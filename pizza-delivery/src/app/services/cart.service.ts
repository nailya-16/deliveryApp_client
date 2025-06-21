import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
    private cartSubject = new BehaviorSubject<{ [pizzaId: number]: number }>({});
    cart$ = this.cartSubject.asObservable();

    getCart() {
        return this.cartSubject.value;
    }

    add(pizzaId: number) {
        const cart = {...this.cartSubject.value};
        cart[pizzaId] = (cart[pizzaId] || 0) + 1;
        this.cartSubject.next(cart);
    }

    remove(pizzaId: number) {
        const cart = {...this.cartSubject.value};
        if (cart[pizzaId]) {
            cart[pizzaId]--;
            if (cart[pizzaId] <= 0) delete cart[pizzaId];
            this.cartSubject.next(cart);
        }
    }

    clear() {
        this.cartSubject.next({});
    }
}