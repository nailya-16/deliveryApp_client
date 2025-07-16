import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null); 
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { 
    const user = localStorage.getItem('user');
    if (user) this.currentUserSubject.next(JSON.parse(user));
  }

  login(email: string, password: string) {
    return this.http.post<{ user: User, token: string }>('http://localhost:3000/api/login', { email, password })
    .pipe(tap(response => {
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      this.currentUserSubject.next(response.user);
    }));
  }

  register(data: { email: string, name: string, password: string }) {
    return this.http.post<User>('http://localhost:3000/api/register', data);
  }

  updateProfile(data: any, avatarBase64?: string) {

    if (avatarBase64) {
      data.avatar = avatarBase64;
    }
    return this.http.put<User>('/api/profile', data).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  changePassword(newPassword: string) {
    return this.http.post<{success: boolean}>('/api/change-password', { password: newPassword });
  }

  deleteAccount() {
    return this.http.delete<{success: boolean}>('/api/profile').pipe(
      tap(() => {
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
      })
    );
  }
  
  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  get isLoggedIn() {
    return !!this.currentUserSubject.value;
  }

  get userValue(): User | null {
    return this.currentUserSubject.value;
  }
}
