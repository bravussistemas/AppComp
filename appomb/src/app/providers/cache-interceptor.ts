import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Apenas cacheia requisições GET
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    // Verifica se a resposta está no cache
    const cachedResponse = this.cacheService.get(req.urlWithParams);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    // Se não estiver no cache, faz a requisição e armazena a resposta
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cacheService.set(req.urlWithParams, event);
        }
      })
    );
  }
}
