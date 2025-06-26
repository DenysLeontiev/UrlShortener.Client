import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../_services/auth-service/auth-service';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserJwt } from '../../_models/userJwt';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    map(user => {
      if (!user) {
        toastr.info('Log in to continue');
        router.navigateByUrl('/login');
        return false;
      }

      if (isTokenExpired(user)) {
        toastr.info('Log in to continue');
        router.navigateByUrl('/login');
        return false;
      }

      return true;
    })
  );
};

function isTokenExpired(user: UserJwt) {
  const expiry = JSON.parse(atob(user.token.split('.')[1])).exp;
  return (Math.floor(Date.now() / 1000) >= expiry);
}