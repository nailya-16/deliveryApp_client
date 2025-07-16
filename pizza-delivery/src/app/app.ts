import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayout } from "./layout/app-layout/app-layout";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JWTInterceptor } from './interceptors/jwt.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppLayout, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
  ]
})
export class App {
  protected title = 'pizza-delivery';
}
