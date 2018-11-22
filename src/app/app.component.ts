import { Auth } from '@core/auth/models/auth.interface';
import { AuthDataPersistenceService } from './core/auth/services/auth-data-persistence.service';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@core/auth/auth.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  pages = [
    {
      title: 'Settings',
      url: '/settings',
    }
  ];

  authData$: Observable<Auth>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService,
    private authData: AuthDataPersistenceService,
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.authData$ = this.authData.getAuthDataObserver();

    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.pages.map( p => {
          return p['active'] = (event.url === p.url);
        });
      }
    });
  }

  logout() {
    this.authService.logout()
    .then( _ => {
      this.router.navigateByUrl('/login');
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.translateService.setDefaultLang('pt');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
