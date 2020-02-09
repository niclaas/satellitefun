import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/components/page-not-found.component';
import { MainComponent } from './main/components/main.component';
import { LoginComponent } from './auth/components/login/login.component';

import { FormsModule } from '@angular/forms';
import { ValidEmailDirective } from './shared/directives/valid-email.directive';

import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

import { HttpClientModule } from '@angular/common/http';

import { SatellitesComponent } from './satellites/components/list/satellites.component';
import { SatelliteDetailModalComponent } from './satellites/components/detail/satellite-detail-modal.component';

import { NgbdSortableHeader } from './shared/directives/sortable.directive';

import { MapComponent } from './satellites/components/map/map.component';
import { coordinateDirectionPipe } from './satellites/coordinate-direction.pipe';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('[my key]')
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    MainComponent,
    LoginComponent,
    ValidEmailDirective,
    SatellitesComponent,
    SatelliteDetailModalComponent,
    NgbdSortableHeader,
    MapComponent,
    coordinateDirectionPipe
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SocialLoginModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [SatelliteDetailModalComponent]
})
export class AppModule { }
