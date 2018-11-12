import { Auth } from '@core/auth/models/auth.interface';
import { AuthDataPersistenceService } from '@core/auth/services/auth-data-persistence.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authData$: Observable<Auth>;

  constructor(
    private apiService: ApiService,
    private authDataPersistenceService: AuthDataPersistenceService,
  ) {
    this.authData$ = this.authDataPersistenceService.getAuthDataObserver();
  }

  public login(credentials) {
    return this.apiService.login(credentials)
    .then((response) => {
      this.authDataPersistenceService.set(response)
      .then( _ => {

      })
      .catch((err) => {
        console.log(err);
      });
    });
  }

  public logout() {
    return this.authDataPersistenceService.clear()
    .then( _ => {

    });
  }
}
