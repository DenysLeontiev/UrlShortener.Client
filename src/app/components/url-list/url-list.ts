import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { COMMON_IMPORTS } from '../../shared-imports';
import { UrlService } from '../../_services/url/url-service';
import { ToastrService } from 'ngx-toastr';
import { CreateShortenedUrl } from '../../_models/createShortenedUrl';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../_services/auth-service/auth-service';

@Component({
  selector: 'app-url-list',
  imports: [COMMON_IMPORTS],
  templateUrl: './url-list.html',
  styleUrl: './url-list.scss'
})
export class UrlList implements OnInit, OnDestroy {

  public urlService: UrlService = inject(UrlService);
  public authService: AuthService = inject(AuthService);
  private toastr: ToastrService = inject(ToastrService);

  public createShortenedUrl: CreateShortenedUrl = {
    url: ''
  }

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.loadUrls();
  }

  ngOnDestroy(): void {
    this.urlService.clearUrls();

    this.destroy$.next();
    this.destroy$.complete();
  }

  public loadUrls(): void {
    this.urlService.getUrls().pipe(takeUntil(this.destroy$)).subscribe((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    })
  }

  public shortenUrl(): void {
    if (!this.createShortenedUrl.url) {
      return;
    }

    this.urlService.createShortenedUrl(this.createShortenedUrl).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.toastr.success("Url is shortened");
      this.createShortenedUrl.url = '';
    }, (error) => {
      this.toastr.error(error.error);
    });
  }

  public deleteUrl(id: string): void {
    this.urlService.delete(id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.toastr.error("Url has been deleted");
    }, (error) => {
      console.log(error);
      this.toastr.error(error);
    });
  }

  public copyToClipboard(url: string): void {
    navigator.clipboard.writeText(url);
    this.toastr.success("Copied to Clipboard");
  }
}
