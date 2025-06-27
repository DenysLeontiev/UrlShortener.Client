import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { UrlParams } from '../../_models/urlParams';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { Url } from '../../_models/url';
import { PaginatedResult, Pagination } from '../../_models/pagination';
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

  private paginationSource = new BehaviorSubject<Pagination | null>(null);
  public pagination$ = this.paginationSource.asObservable();

  public getUrls(): Observable<PaginatedResult<Url[]>> {
    let params = getPaginationHeaders(this.urlParams);

    return getPaginatedResult<Url[]>(this.baseUrl + 'urls', params, this.http).pipe(tap(paginatedRes => {
      this.urlsSource.next(paginatedRes.result!);
      this.paginationSource.next(paginatedRes.pagination || null);
    }))
  }

  public getUrlById(id: string): Observable<Url> {
    return this.http.get<Url>(this.baseUrl + 'urls/' + id);
  }

  public createShortenedUrl(createShortenedUrl: CreateShortenedUrl): Observable<Url> {
    return this.http.post<Url>(this.baseUrl + 'urls/shorten', createShortenedUrl).pipe(tap(shortenedUrl => {
      const updatedUrls = [shortenedUrl, ...this.urlsSource.value];
      this.urlsSource.next(updatedUrls);
    }));
  }

  public delete(id: string): Observable<Object> {
    return this.http.delete(this.baseUrl + 'urls/' + id).pipe(tap(() => {
      const currentUrls = this.urlsSource.value;
      const updatedUrls = currentUrls.filter(url => url.id !== id);
      this.urlsSource.next(updatedUrls);
    }));
  }

  public deleteAll(): Observable<Object> {
    return this.http.delete(this.baseUrl + 'urls/delete-all').pipe(tap(() => {
      this.clearUrls();
      this.paginationSource.next(null);
    }));
  }

  public clearUrls(): void {
    this.urlsSource.next([]);
    this.urlParams.pageNumber = 1;
  }
}
