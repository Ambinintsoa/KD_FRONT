// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredProfile = route.data['profile'] as string; // Profil requis pour la route

  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const userProfile = authService.getUserProfile();
  if (requiredProfile && userProfile !== requiredProfile) {
    router.navigate(['/unauthorized']); // Page pour accès non autorisé
    return false;
  }

  return true;
};