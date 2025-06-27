import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserJwt } from '../../_models/userJwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  private baseUrl: string = environment.baseUrl;

  public readonly shortenUrlUserKey: string = "shorten-url-user";

  private currentUserSource: BehaviorSubject<UserJwt | null> = new BehaviorSubject<UserJwt | null>(null);
  public currentUser$: Observable<UserJwt | null> = this.currentUserSource.asObservable();

  private userRolesSource: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public userRoles$: Observable<string[]> = this.userRolesSource.asObservable();

  public register(model: any): Observable<UserJwt> {
    return this.http.post<UserJwt>(this.baseUrl + 'account/register', model).pipe(tap((user: UserJwt) => {
      if (user) {
        this.setCurrentUser(user);
      }
    }))
  }

  public login(model: any): Observable<UserJwt> {
    return this.http.post<UserJwt>(this.baseUrl + 'account/login', model).pipe(
      tap((user: UserJwt) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  public logout(): void {
    this.router.navigateByUrl('/');
    localStorage.removeItem(this.shortenUrlUserKey);
    this.currentUserSource.next(null);
  }

  public setCurrentUser(userJwt: UserJwt): void {
    localStorage.setItem(this.shortenUrlUserKey, JSON.stringify(userJwt));
    this.currentUserSource.next(userJwt);

    this.setUserRoles(userJwt);
  }

  private setUserRoles(userJwt: UserJwt): void {
    this.userRolesSource.next(userJwt.roles);
  }
}
