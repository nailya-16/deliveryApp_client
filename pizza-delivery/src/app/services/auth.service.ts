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
    return this.http.post<User>('/api/login', { email, password })
    .pipe(tap(user => {
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }));
  }

  register(data: { email: string, name: string, password: string }) {
    return this.http.post<User>('/api/register', data);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  get isLoggedIn() {
    return !!this.currentUserSubject.value;
  }
}
