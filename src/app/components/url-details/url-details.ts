import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Url } from '../../_models/url';
import { COMMON_IMPORTS } from '../../shared-imports';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { UrlService } from '../../_services/url/url-service';

@Component({
  selector: 'app-url-details',
  imports: [COMMON_IMPORTS],
  templateUrl: './url-details.html',
  styleUrl: './url-details.scss'
})
export class UrlDetails implements OnInit, OnDestroy {

  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private urlService: UrlService = inject(UrlService);

  public url: Url | null = null;

  private routeSub: Subscription | null = null;

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      let id: string = params['id'];
      this.loadUrl(id);
    });
  }

  private loadUrl(id: string): void {
    this.urlService.getUrlById(id).pipe(takeUntil(this.destroy$)).subscribe((url: Url) => {
      this.url = url;
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();

    this.destroy$.next();
    this.destroy$.complete();
  }
}
