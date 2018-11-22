import { AuthDataPersistenceService } from '@core/auth/services/auth-data-persistence.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  authData$: Observable<any>;

  constructor(
    private authDataPersistenceService: AuthDataPersistenceService,
    private router: Router,
  ) {
    this.authData$ = this.authDataPersistenceService.getAuthDataObserver();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    console.log('canActivate');

    return this.authData$.pipe(
      map(authData => {
        console.log('authguard: ', authData);
        if (!authData) {
          this.router.navigate(['/login'], {
            queryParams: {
              return: state.url
            }
          });
        }

        return !!authData;
        }
      ),
      catchError(() => {
        console.log('AuthStateObserver, catchError ');
        this.router.navigate(['/login'], {
          queryParams: {
            return: state.url
          }
        });
        return of(false);
      })
    );
  }
}
