import { Component, inject } from '@angular/core';
import { AuthService } from '../../_services/auth-service/auth-service';
import { COMMON_IMPORTS } from '../../shared-imports';

@Component({
  selector: 'app-navbar',
  imports: [COMMON_IMPORTS],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  public authService: AuthService = inject(AuthService);

  public logout(): void {
    this.authService.logout();
  }
}
