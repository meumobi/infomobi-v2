import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { Auth } from '@core/auth/models/auth.interface';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthDataPersistenceService {

  private authData$ = new ReplaySubject<Auth|null>(1);

  constructor(
    private storage: Storage
  ) {
    console.log('AuthDataPersistenceService');
    this.storage.get('authData')
    .then( data => {
      this.authData$.next(JSON.parse(data));
    });
  }

  public set(data): Promise<void> {

    return this.storage.set('authData', JSON.stringify(data))
    .then( () => {
      this.authData$.next(data);
      // this.isLogged$.next(true);
    });
  }

  public getAuthDataObserver(): Observable<Auth|null> {

    return this.authData$.asObservable();
  }

  public clear(): Promise<void> {

    return this.storage.remove('authData')
    .then( () => {
      this.authData$.next(null);
    });
  }
}
