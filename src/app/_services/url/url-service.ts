import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { UrlParams } from '../../_models/urlParams';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { Url } from '../../_models/url';
import { PaginatedResult } from '../../_models/pagination';
import { getPaginatedResult, getPaginationHeaders } from '../../_helpers/paginationHelpers';
import { CreateShortenedUrl } from '../../_models/createShortenedUrl';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private http: HttpClient = inject(HttpClient);

  private baseUrl: string = environment.baseUrl;

  public urlParams: UrlParams = new UrlParams();

  private urlsSource: BehaviorSubject<Url[]> = new BehaviorSubject<Url[]>([]);
  public urls$: Observable<Url[]> = this.urlsSource.asObservable();

  public getUrls(): Observable<PaginatedResult<Url[]>> {
    let params = getPaginationHeaders(this.urlParams);

    return getPaginatedResult<Url[]>(this.baseUrl + 'urls', params, this.http).pipe(tap(paginatedRes => {
      this.urls$.pipe(take(1)).subscribe((urls) => {
        let extendedUrls = urls.concat(paginatedRes.result!);
        this.urlsSource.next(extendedUrls);
      });
    }))
  }

  public getUrlById(id: string): Observable<Url> {
    return this.http.get<Url>(this.baseUrl + 'urls/' + id);
  }

  public createShortenedUrl(createShortenedUrl: CreateShortenedUrl): Observable<Url> {
    return this.http.post<Url>(this.baseUrl + 'urls/shorten', createShortenedUrl).pipe(tap(shortenedUrl => {
      this.urls$.pipe(take(1)).subscribe((urls) => {
        urls.unshift(shortenedUrl);
        this.urlsSource.next(urls);
      })
    }));
  }

  public delete(id: string): Observable<Object> {
    return this.http.delete(this.baseUrl + 'urls/' + id).pipe(tap(() => {
      this.urls$.pipe(take(1)).subscribe((urls) => {
        let filteredUrls = urls.filter(x => x.id !== id);
        this.urlsSource.next(filteredUrls);
      })
    }));
  }

  public clearUrls(): void {
    this.urlsSource.next([]);
    this.urlParams.pageNumber = 1;
  }
}
