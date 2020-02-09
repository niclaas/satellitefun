import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeAuthService } from '../../auth/native-auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public nativeAuthService: NativeAuthService, public router: Router) { }

  public language: string;
  public alternateLanguage: string;

  ngOnInit() {
    this.language = this.router.url.match(/kl/gi) != null ? 'tlhIngan' : 'English';
    this.alternateLanguage = this.router.url.match(/kl/gi) != null ? 'English' : 'tlhIngan';
  }

  logout() {
    this.nativeAuthService.logout();
  }

  navigateToAlternateLanguage() {
    if (this.router.url.match(/kl/gi) != null) {
      window.location.href = 'https://satellitefun.azurewebsites.net';
      return false;
    }
    else {
      window.location.href = 'https://satellitefun.azurewebsites.net/kl';
      return false;
    }
  }
}
