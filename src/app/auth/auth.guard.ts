import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { NativeAuthService } from './native-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private nativeAuthService: NativeAuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let path = state.url;
    return this.userCanAccess(path);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

    let path = route.path;
    return this.userCanAccess(path);
  }

  userCanAccess(path: string): boolean {
    if (this.nativeAuthService.isLoggedIn) {
      if (path.match(/spy-stuff/)) {
        if (this.nativeAuthService.emailAddress.endsWith('matogen.com')) {
          return true;  
        }
      }
      else {
        return true;
      }
    }

    this.nativeAuthService.redirectUrl = path;
    this.router.navigate(['/login']);
    return false;
  }
}
