import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUser = signal<User | null>(null);

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

    register(username: string, password: string): Observable<User> {
        return this.http.post<User>(`${environment.apiUrl}/user/register`, { username, password }).pipe(
            catchError(this.handleError)
        );
    }

    logout(): void {
        this.cookieService.delete('access_token', '/');
        this.cookieService.delete('refresh_token', '/');
        this.currentUser.set(null);
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

    refreshToken(): Observable<User> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            this.logout();
            return throwError(() => new Error('Aucun refresh token disponible'));
        }

        return this.http.post<User>(`${environment.apiUrl}/user/refresh`, { refreshToken }).pipe(
            tap(response => {
                if (response?.token) {
                    this.storeUser(response.token);
                }
            }),
            catchError(this.handleError)
        );
    }

    private storeUser(token: any) {
        const decodedToken = this.decodeToken(token.token_access);
        const decodedTokenRefresh = this.decodeToken(token.token_access);
        if (!decodedToken) return;

        const user: User = {
            userId: decodedToken.userId,
            username: decodedToken.username,
            role: decodedToken.role,
            email: decodedToken.email,
            token
        };
        console.log(new Date())
        console.log(new Date(decodedToken.exp) )
        const expirationDateAcces = decodedToken.exp ? new Date(decodedToken.exp) : undefined;
        const expirationDateRefresh = decodedTokenRefresh.exp ? new Date(decodedTokenRefresh.exp) : undefined;

        this.cookieService.set('access_token', token.token_access, {
            expires: expirationDateAcces,
            path: '/',
            secure: false, // Mettez `true` en production
            sameSite: 'Strict'
        });

        this.cookieService.set('refresh_token', token.token_refresh, {
            expires: expirationDateRefresh,
            path: '/',
            secure: false,
            sameSite: 'Strict'
        });

        this.currentUser.set(user);
    }

    private handleError(error: any) {
        console.error('Erreur API:', error);
        return throwError(() => new Error(error?.error?.message || 'Une erreur est survenue'));
    }
}
