import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeAuthService } from '../../native-auth.service';
import { LoginCredentialsModel } from '../../models/login-credentials.model';
import { AuthService } from 'angularx-social-login';
import { GoogleLoginProvider/*, FacebookLoginProvider */ } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model = new LoginCredentialsModel('', '');
  authenticationFailed = false;

  constructor(
    private nativeAuthService: NativeAuthService
    , private authService: AuthService
    ,  private router: Router) { }

  ngOnInit() {
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  auth() {
    if (!this.nativeAuthService.login(this.model.email, this.model.password))
     this.authenticationFailed = true;
  }
}
