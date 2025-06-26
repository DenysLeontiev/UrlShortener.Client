import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../_services/auth-service/auth-service';
import { inject } from '@angular/core';
import { switchMap, take } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const authService: AuthService = inject(AuthService);

  return authService.currentUser$.pipe(
    take(1),
    switchMap(user => {

      if (user) {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${user.token}`
          }
        });
        return next(cloned);
      }
      return next(req);
    })
  );
};
