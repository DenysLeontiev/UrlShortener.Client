import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AboutPage } from '../../_models/aboutPage';
import { EditAboutPage } from '../../_models/editAboutPage';

@Injectable({
  providedIn: 'root'
})
export class AboutPageService {

  private http: HttpClient = inject(HttpClient);

  private baseUrl: string = environment.baseUrl;

  private aboutPageSource: BehaviorSubject<AboutPage> = new BehaviorSubject<AboutPage>({} as AboutPage);
  public aboutPage$: Observable<AboutPage> = this.aboutPageSource.asObservable();

  constructor() { }

  public getAboutPage(): Observable<AboutPage> {
    return this.http.get<AboutPage>(this.baseUrl + 'about').pipe(tap((page: AboutPage) => {
      this.aboutPageSource.next(page);
    }));
  }

  public editAboutPage(editAboutPage: EditAboutPage): Observable<AboutPage> {

    return this.http.post<AboutPage>(this.baseUrl + 'about/edit', editAboutPage).pipe(tap((page: AboutPage) => {

      this.aboutPageSource.next(page);
    }))
  }
}
