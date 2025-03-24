import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    let token = authService.getToken();

    if (token && !authService.isTokenValid()) {
        return authService.refreshToken().pipe(
            switchMap(() => {
                token = authService.getToken();
                const authReq = req.clone({
                    setHeaders: { Authorization: `Bearer ${token}` }
                });
                return next(authReq);
            }),
            catchError(err => {
                authService.logout();
                return throwError(() => err);
            })
        );
    }

    if (token) {
        req = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }
    return next(req);
};