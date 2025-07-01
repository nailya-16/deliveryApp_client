import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  tabs = [
    { key: 'main', label: 'Профиль' },
    { key: 'activity', label: 'Активность' },
    { key: 'notifications', label: 'Уведомления' },
    { key: 'history', label: 'История' },
    { key: 'settings', label: 'Настройки' },
    { key: 'security', label: 'Безопасность' },
    { key: 'delete', label: 'Удалить' }
  ];
  activeTab = 'main';

  user: any = null;

  profileForm: FormGroup;
  passwordForm: FormGroup;
  profileSuccess = false;
  passwordSuccess = false;
  passwordError = '';
  deleteSuccess = false;
  deleteError = '';
  avatarPreview: string | undefined;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      city: [''],
      social: ['']
    });
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.user = this.auth.userValue;
    if (!this.user) {
      this.router.navigate(['/auth']);
      return;
    }
    this.profileForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone || '',
      city: this.user.city || '',
      social: this.user.social || ''
    });
    this.avatarPreview = this.user.avatar || undefined;
  }

  async onProfileSave() {
    if (this.profileForm.invalid) return;
    this.loading = true;
    this.profileSuccess = false;
    try {
      const updated = await this.auth.updateProfile(this.profileForm.value, this.avatarPreview).toPromise();
      this.user = updated;
      this.profileSuccess = true;
    } catch (e: any) {
      //добавить обработку ошибки
    }
    this.loading = false;
  }

  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.avatarPreview = undefined;
    };
    reader.readAsDataURL(file);
  }

  

  async onPasswordSave() {
    if (this.passwordForm.invalid) return;
    if (this.passwordForm.value.password !== this.passwordForm.value.password2) {
      this.passwordError = 'Пароли не совпадают';
      return;
    }
    this.loading = true;
    this.passwordSuccess = false;
    this.passwordError = '';
    try {
      await this.auth.changePassword(this.passwordForm.value.password).toPromise();
      this.passwordSuccess = true;
      this.passwordForm.reset();
    } catch (e: any) {
      this.passwordError = e?.error?.message || 'Ошибка смены пароля';
    }
    this.loading = false;
  }

  // Удаление аккаунта
  async deleteAccount() {
    if (!confirm('Вы уверены, что хотите удалить аккаунт?')) return;
    this.loading = true;
    this.deleteSuccess = false;
    this.deleteError = '';
    try {
      await this.auth.deleteAccount().toPromise();
      this.deleteSuccess = true;
      this.auth.logout();
      this.router.navigate(['/auth']);
    } catch (e: any) {
      this.deleteError = e?.error?.message || 'Ошибка удаления аккаунта';
    }
    this.loading = false;
  }

  // Смена темы
  onThemeChange() {
    // Например, сохраняем в localStorage, либо вызываем сервис/метод
    localStorage.setItem('theme', this.user.theme);
  }


  logout() {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }
}
