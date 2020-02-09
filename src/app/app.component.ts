import { Component, OnInit } from '@angular/core';
import { AuthService } from 'angularx-social-login';
import { NativeAuthService } from './auth/native-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService,
    private nativeAuthService: NativeAuthService ) {}

  title = 'spy-satellite-fun';

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      if (user != null && user.email != null && user.email.length > 0) {
        if (!this.nativeAuthService.isLoggedIn) {
          this.nativeAuthService.setLoggedIn(user.email, true);
        }
      }
    });
  }
}
