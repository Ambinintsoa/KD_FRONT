// src/app/interceptors/jwt.interceptor.ts
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service'; // Assurez-vous que le chemin est correct
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export function jwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const token = authService.getToken(); // Récupérer le token actuel

  // Cloner la requête et ajouter le header Authorization si un token existe
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // Ajouter le token dans le header
      }
    });
  }

  // Passer la requête (avec ou sans token) au handler suivant
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Si erreur 401, tenter de rafraîchir le token
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Après rafraîchissement, récupérer le nouveau token
            const newToken = authService.getToken();
            // Cloner à nouveau la requête avec le nouveau token
            const refreshedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            // Relancer la requête avec le nouveau token
            return next(refreshedReq);
          }),
          catchError((refreshError) => {
            // Si le rafraîchissement échoue, déconnecter l'utilisateur
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      // Pour les autres erreurs, simplement les relancer
      return throwError(() => error);
    })
  );
}