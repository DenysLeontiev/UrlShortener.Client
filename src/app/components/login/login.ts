import { Component, inject } from '@angular/core';
import { AuthService } from '../../_services/auth-service/auth-service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  
  private authService: AuthService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router)

  public loginForm = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl(''),
  });

  public login(): void {
    this.authService.login(this.loginForm.value).subscribe((response) => {
      this.router.navigateByUrl('url-list');
      console.log(response);
    }, error => {
      this.toastr.error(error.error)
      console.log(error);
    });
  }
}
