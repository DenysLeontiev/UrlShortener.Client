import { Component, inject } from '@angular/core';
import { AuthService } from '../../_services/auth-service/auth-service';
import { COMMON_IMPORTS } from '../../shared-imports';

@Component({
  selector: 'app-about-algorithm',
  imports: [COMMON_IMPORTS],
  templateUrl: './about-algorithm.html',
  styleUrl: './about-algorithm.scss'
})
export class AboutAlgorithm {

  public authService: AuthService = inject(AuthService);
}
