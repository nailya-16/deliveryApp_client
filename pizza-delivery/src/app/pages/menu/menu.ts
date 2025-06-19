import { Component, OnInit } from '@angular/core';
import { Pizza } from '../../models/pizza';
import { PizzaService } from '../../services/pizza';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private pizzaService: PizzaService) {}

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
}
