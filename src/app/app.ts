import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./components/navbar/navbar";
import { UserJwt } from './_models/userJwt';
import { AuthService } from './_services/auth-service/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
    
  ngOnInit(): void {
    this.setCurrentUser();
  }

  private authService = inject(AuthService);

  public setCurrentUser(): void {
    const user: UserJwt = JSON.parse(localStorage.getItem(this.authService.shortenUrlUserKey)!);
    if (user) {
      this.authService.setCurrentUser(user);
    }
  }
}
