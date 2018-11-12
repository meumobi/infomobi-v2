import { AuthDataPersistenceService } from '@core/auth/services/auth-data-persistence.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  isLogged$: Observable<boolean>;

  constructor(
    private authDataPersistenceService: AuthDataPersistenceService,
    private router: Router,
  ) {
    this.isLogged$ = this.authDataPersistenceService.getIsLoggedObserver();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    console.log('canActivate');

    return this.isLogged$.pipe(
      map(isLogged => {
        console.log('authguard: ', isLogged);
        if (!isLogged) {
          this.router.navigate(['/login'], {
            queryParams: {
              return: state.url
            }
          });
        }

        return isLogged;
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
