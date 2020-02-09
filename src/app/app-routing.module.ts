import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/components/page-not-found.component';
import { MainComponent } from './main/components/main.component';
import { LoginComponent } from './auth/components/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { SatellitesComponent } from './satellites/components/list/satellites.component';
import { MapComponent } from './satellites/components/map/map.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'satellites/all', component: SatellitesComponent },
      { path: 'satellites/visible', component: SatellitesComponent },
      { path: 'satellites/map', component: MapComponent },
      { path: 'satellites', redirectTo: '/satellites/all' },
      {
        path: 'spy-stuff',
        loadChildren: () => import('./spy-stuff/spy-stuff.module')
        .then(m => m.SpyStuffModule),
        canLoad: [AuthGuard]
      },
      { path: '', redirectTo: '/satellites/all', pathMatch: 'full' }
    ]
  },
  { 
    path: '**', component: PageNotFoundComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes/*, { enableTracing: true }*/)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
