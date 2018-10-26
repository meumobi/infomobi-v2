import { AuthService } from './../core/auth/auth.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  authState$: Observable<boolean>;
  return: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.authState$ = this.authService.getAuthStateObserver();
     // Get the query params
     this.route.queryParams
     .subscribe(params => this.return = params['return'] || '/');
  }

  login() {
    this.authService.login().then(
      () => this.router.navigateByUrl(this.return)
    );
  }

  logout() {
    this.authService.logout();
  }
}
