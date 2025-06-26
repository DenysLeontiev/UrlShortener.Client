import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../_services/auth-service/auth-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  private authService: AuthService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  public registerForm = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl(''),
  });

  public register(): void {
    this.authService.register(this.registerForm.value).subscribe((response) => {
      this.router.navigateByUrl('url-list');
      console.log(response);
    }, error => {
      this.toastr.error(error.error)
      console.log(error);
    });
  }
}
