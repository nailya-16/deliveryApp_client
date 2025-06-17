import { Component, OnInit } from '@angular/core';
import { Pizza } from '../../models/pizza';
import { PizzaService } from '../../services/pizza';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu implements OnInit {
  pizzas: Pizza[] = [];
  loading = true;
  error = '';

  constructor(private pizzaService: PizzaService) {}

  ngOnInit(): void {
    this.pizzaService.getPizzas().subscribe({
      next: (data) => {
        this.pizzas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Ошибка загрузки меню';
        this.loading = false;
      }
    });
  }
}
