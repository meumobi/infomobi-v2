import { MenuController, LoadingController } from '@ionic/angular';
import { AuthService } from '@core/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  return: '';
  loginForm: FormGroup;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private menuCtrl: MenuController,
    private loadingController: LoadingController,
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

  async loginUser() {
    this.loading = true;

    const formValue = this.loginForm.value;
    console.log('Return url: ', this.return);

    const loading = await this.loadingController.create({
      message: 'Signin...'
    });
    await loading.present();

    this.authService.login(formValue)
      .then(
        () => {
          loading.dismiss();
          this.router.navigateByUrl(this.return);
        }
      )
      .catch(
        (err) => {
          loading.dismiss();
          console.log(err);
        }
      );
  }
}
