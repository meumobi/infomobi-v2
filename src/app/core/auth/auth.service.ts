import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const TOKEN_KEY = 'X-Auth-Token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(
    private storage: Storage,
    private platform: Platform
  ) {
    this.platform.ready().then( _ => {
      this.checkToken();
    });
  }

  private checkToken() {
    this.storage.get(TOKEN_KEY).then( res => {
      if (res) {
        this.authState$.next(true);
      }
    });
  }

  public login() {
    return this.storage.set(TOKEN_KEY, 'Bearer 123456').then( res => {
      this.authState$.next(true);
    });
  }

  public logout() {
    this.storage.remove(TOKEN_KEY).then( _ => {
      this.authState$.next(false);
    });
  }

  public getAuthStateObserver(): Observable<boolean> {
    return this.authState$.asObservable();
  }

  public isAuthenticated() {
    console.log(this.authState$.value);
    return this.authState$.value;
  }
}
