import { Injectable } from '@angular/core';
import { AuthService } from 'angularx-social-login';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NativeAuthService {

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }

  isLoggedIn = false;
  redirectUrl: string;
  emailAddress: string;
  loggedInViaSocial: boolean;

  login(email: string, password: string): boolean {
    if (email && email.length > 0 && password === 'P@ssw0rd123') {
      this.setLoggedIn(email);
      return true;
    }
    return false;
  }

  setLoggedIn(email: string, social: boolean = false): void {
    this.isLoggedIn = true;
    this.emailAddress = email;
    this.loggedInViaSocial = social;
    if (this.redirectUrl && this.redirectUrl.length > 0)
      this.router.navigateByUrl(this.redirectUrl);
    else
      this.router.navigate(['/satellites']);
  }

  logout(): void {
    if (this.loggedInViaSocial)
    {
      this.authService.signOut();
    }
    this.isLoggedIn = false;
    this.emailAddress = '';
    this.router.navigateByUrl('/login');
  }

  canSeeSpyStuff(): boolean {
    return this.emailAddress.endsWith("matogen.com");
  }
}
