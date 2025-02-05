import { Observable } from "rxjs";
import { CacheService } from "ionic-cache";

interface ICachedServiceBase {
  clean(): Promise<any>;
}

export class CachedServiceBase implements ICachedServiceBase {

  constructor(public cacheGroupName: string, public cache: CacheService) {
  }

  clean(): Promise<any> {
    return this.cache.clearGroup(this.cacheGroupName);
  }

  cacheRequest(key: string, request: Observable<any>, ttl = 604800) {
    return this.cache.loadFromObservable(key, request, this.cacheGroupName, ttl); // ttl: 7 days
  }
}