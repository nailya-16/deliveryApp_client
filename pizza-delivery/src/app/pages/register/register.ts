import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const password2 = control.get('password2')?.value;
  return password === password2 ? null : { mismatch: true};
}
  @Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password2: new FormControl('', Validators.required),
  }, { validators: passwordMatchValidator });

  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router){}

  async onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    try {
      await this.auth.register({
        name: this.form.value.name as string,
        email: this.form.value.email as string,
        password: this.form.value.password as string
      }).toPromise();
      this.router.navigate(['/login']);
    } catch (e: any) {
      this.error = e?.error?.message || 'Ошибка регистрации';
    }
    this.loading = false;
  }
}
