import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPage {
  mode: 'login' | 'register' = 'login';

  loginForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', Validators.required],
    });
  }

  switchMode(mode: 'login' | 'register') {
    this.mode = mode;
    this.error = '';
  }

  async onLogin() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';
    try {
      await this.auth.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      ).toPromise();
      this.router.navigate(['/profile']);
    } catch (e: any) {
      this.error = e?.error?.message || 'Ошибка входа';
    }
    this.loading = false;
  }

  async onRegister() {
    if (this.registerForm.invalid) return;
    if (this.registerForm.value.password !== this.registerForm.value.password2) {
      this.error = 'Пароли не совпадают';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      await this.auth.register({
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      }).toPromise();
      await this.auth.login(
        this.registerForm.value.email,
        this.registerForm.value.password
      ).toPromise();
      this.router.navigate(['/profile']);
    } catch (e: any) {
      this.error = e?.error?.message || 'Ошибка регистрации';
    }
    this.loading = false;
  }
}
