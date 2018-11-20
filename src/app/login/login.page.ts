import { MenuController } from '@ionic/angular';
import { AuthDataPersistenceService } from '@core/auth/services/auth-data-persistence.service';
import { AuthService } from './../core/auth/auth.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isLogged$: Observable<boolean>;
  return: '';
  loginForm: FormGroup;
  loading = false;

  constructor(
    private authService: AuthService,
    private authDataPersistenceService: AuthDataPersistenceService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private menuCtrl: MenuController,
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', [
        Validators.required
      ]]
    });

    this.isLogged$ = this.authDataPersistenceService.getIsLoggedObserver();

     // Get the query params
     this.route.queryParams
     .subscribe(params => this.return = params['return'] || '/');
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menuCtrl.enable(true);
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  loginUser() {
    this.loading = true;

    const formValue = this.loginForm.value;

    this.authService.login(formValue)
      .then(
        () => this.router.navigateByUrl(this.return)
      )
      .catch(
        (err) => console.log(err)
      );
  }

  logout() {
    this.authService.logout();
  }
}
