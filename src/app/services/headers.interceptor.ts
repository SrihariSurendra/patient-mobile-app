import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from './loader.service';
import { environment } from 'src/environments/environment';

export const BYPASS_LOG = new HttpContextToken(() => false);

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    if (!this.isExcludedAPI(request.url)) {
      this.loaderService.show();
    }

    if (request.context.get(BYPASS_LOG) === true) {
      request = request.clone({
        setHeaders: {
          'Access-Control-Allow-Origin': '*'
        }
      });
      return next.handle(request);
    } else {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Basic ' + btoa('admin' + ':' + '123456'),
        }
      });
      return next.handle(request).pipe(
        finalize(() => this.loaderService.hide()),
      );
    }
  }

  private isExcludedAPI(url: string): boolean {
    return environment.loaderExclude.some(excludedUrl =>
      url.includes(excludedUrl)
    );
  }
}
