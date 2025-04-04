import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateUser } from '../models/CreateUser';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private currentUser = signal<User | null>(null);
    private router = inject(Router);
    private userProfile: string | null = null;
    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {
        this.loadUserFromCookies();
    }

    private loadUserFromCookies() {
        const accessToken = this.cookieService.get('access_token');
        const refreshToken = this.cookieService.get('refresh_token');

        if (accessToken && refreshToken) {
            const decodedToken = this.decodeToken(accessToken);
            if (decodedToken) {
                this.currentUser.set({
                    userId: decodedToken.userId,
                    username: decodedToken.username,
                    role: decodedToken.role,
                    email: decodedToken.email,
                    token: {
                        token_access: accessToken,
                        token_refresh: refreshToken,
                        expiration: decodedToken.exp ? new Date(decodedToken.exp * 1000).toISOString() : "0"
                    }
                });
            }
        }
    }

    getCurrentUser = () => this.currentUser.asReadonly();

    login(email: string, mot_de_passe: string): Observable<User> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<User>(`${environment.apiUrl}/user/login`, { email, mot_de_passe }, { headers }).pipe(
            tap(response => {
                if (response?.token) {
                    this.storeUser(response.token);
                }
            }),
            catchError(this.handleError)
        );
    }

    private decodeToken(token: string): any | null {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload));
        } catch (e) {
            console.error('Erreur lors du décodage du token:', e);
            return null;
        }
    }

    register(user:CreateUser): Observable<User> {
        return this.http.post<User>(`${environment.apiUrl}/user/register`, user);
    }

    logout(): void {
        console.log("logout");
        this.cookieService.delete('access_token', '/');
        this.cookieService.delete('refresh_token', '/');
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
    }

    isLoggedIn(): boolean {
        return !!this.getToken() && this.isTokenValid();
    }

    getToken(): string | null {
        return this.cookieService.get('access_token') || null;
    }

    getRefreshToken(): string | null {
        return this.cookieService.get('refresh_token') || null;
    }

    isTokenValid(): boolean {
        const accessToken = this.getToken();
        if (!accessToken) return false;
        const decoded = this.decodeToken(accessToken);
        return decoded?.exp ? new Date(decoded.exp * 1000) > new Date() : false;
    }
    refreshToken(): Observable<any> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
          this.logout();
          return throwError(() => new Error('Aucun refresh token disponible'));
        }
        return this.http.post<any>(`${environment.apiUrl}/user/refresh`, {refresh: refreshToken }).pipe(
          tap(response => {
            if (response.token) {
              this.storeToken(response.token);
            }
          }),
          catchError(err => {
            this.logout();
            return throwError(() => err);
          })
        );
      }

    private storeUser(token: any) {
        const decodedToken = this.decodeToken(token.token_access);
        const decodedRefreshToken = this.decodeToken(token.token_refresh);
        if (!decodedToken) return;

        const user: User = {
            userId: decodedToken.userId,
            username: decodedToken.username,
            role: decodedToken.role,
            email: decodedToken.email,
            token
        };
        const expirationDate = decodedToken.exp ? new Date(decodedToken.exp*1000) : undefined;

        this.cookieService.set('access_token', token.token_access, {
            expires: expirationDate,
            path: '/',
        });
        const expirationDateRefresh = decodedRefreshToken.exp ? new Date(decodedRefreshToken.exp*1000) : undefined;
        this.cookieService.set('refresh_token', token.token_refresh, {
            expires: expirationDateRefresh,
            path: '/',
        });

        this.currentUser.set(user);
    }

    private handleError(error: any) {
        console.error('Erreur API:', error);
        return throwError(() => new Error(error?.error?.message || 'Une erreur est survenue'));
    }
    storeToken(token: string): void {
        const decodedToken = this.decodeToken(token);
        const expirationDate = decodedToken.exp ? new Date(decodedToken.exp*1000) : undefined;

        this.cookieService.set('access_token', token, {
            expires: expirationDate,
            path: '/'
        });
      }
      getUserProfile(): string | null {
        if (!this.userProfile) {
          const token = this.cookieService.get('access_token');
          if (token) {
            const decoded = this.decodeToken(token);
            this.userProfile = decoded?.role || null; // Supposons que le profil est dans le token
          }
        }
        return this.userProfile;
      }
      isAdmin(): boolean {
        return this.getUserProfile() === 'admin';
      }
      isPersonal():boolean{
        return this.getUserProfile() === 'admin' || this.getUserProfile()== 'mecanicien';
      }
      isMecanicien():boolean{
        return this.getUserProfile()== 'mecanicien';
      }
      isClient():boolean{
        return this.getUserProfile()== 'client';
      }
}