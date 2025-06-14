import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayout } from "./layout/app-layout/app-layout";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppLayout],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'pizza-delivery';
}
