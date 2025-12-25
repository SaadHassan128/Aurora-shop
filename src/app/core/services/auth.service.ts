import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { LoginResponse, User } from '../models/user.model';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = environment.apiUrl;

  // Signals
  private _currentUser = signal<User | null>(null);
  private _token = signal<string | null>(null);

  currentUser = this._currentUser.asReadonly();
  isAuthenticated = computed(() => !!this._token());

  constructor() {
    // Attempt to restore user session if token exists
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this._token.set(token);
        // Fake Store API doesn't have a "me" endpoint based on token easily without ID.
        // We will simulate restoring user for now or fetch a default user (id: 1) as a mock.
        this.fetchUserProfile(1).subscribe();
      }
    }
  }

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    // Use HttpClient directly to avoid ApiService's automatic error logging for 401s
    // since we expect them for demo users.
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        this.setSession(response.token);
        this.fetchUserProfile(1).subscribe();
      }),
      catchError((err) => {
        // Fallback for demo/mock users
        // Only log warning if it's not a 401 (Unauthorized) which is expected for demo users
        if (err.status !== 401) {
          console.warn('Login failed, falling back to mock session for demo');
        }

        const mockToken = 'mock-jwt-token-' + Date.now();
        this.setSession(mockToken);

        // Admin Login Check
        const isAdmin = credentials.username === 'admin' && credentials.password === 'admin1234';
        const role: 'admin' | 'user' = isAdmin ? 'admin' : 'user';

        this._currentUser.set({
          id: isAdmin ? 0 : 999,
          email: isAdmin ? 'admin@aurora.com' : 'demo@example.com',
          username: credentials.username,
          password: credentials.password,
          name: { firstname: isAdmin ? 'Admin' : 'Demo', lastname: isAdmin ? 'User' : 'User' },
          phone: '123-456-7890',
          address: {
            city: 'Demo City',
            street: 'Demo St',
            number: 1,
            zipcode: '12345',
            geolocation: { lat: '0', long: '0' },
          },
          role: role,
        });
        return of({ token: mockToken, role: role });
      })
    );
  }

  isAdmin = computed(() => this._currentUser()?.role === 'admin');

  register(userData: any): Observable<any> {
    // Fake Store API 'addUser' endpoint exists but doesn't actually persist for login.
    // We will simulate a successful registration.
    return this.api.post('/users', userData).pipe(
      map((res) => {
        // Return a mock token to auto-login
        return { token: 'mock-jwt-token-' + Date.now() };
      }),
      tap((res) => {
        this.setSession(res.token);
        // Set the current user to the registered data (mock)
        this._currentUser.set({ ...userData, id: Date.now() });
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this._token.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private setSession(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
    this._token.set(token);
  }

  private fetchUserProfile(id: number): Observable<User> {
    return this.api.get<User>(`/users/${id}`).pipe(
      tap((user) => this._currentUser.set(user)),
      catchError((err) => {
        // If fetch fails (e.g. invalid token/user), logout
        this.logout();
        return throwError(() => err);
      })
    );
  }

  updateProfile(data: Partial<User>) {
    const currentUser = this._currentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...data };
      this._currentUser.set(updatedUser);
      // In a real app, you would make an API call here.
      // For this demo, we'll just update the local state.
    }
  }
}
