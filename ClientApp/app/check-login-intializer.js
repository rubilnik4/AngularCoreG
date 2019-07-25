import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
export function checkIfUserIsAuthenticated(accountService) {
    return function () {
        return accountService.updateUserAuthenticationStatus().pipe(catchError(function (_) {
            console.error('Error trying to validate if the user is authenticated. The most probable cause is that the ASP.NET Core project isn\'t running');
            return of(null);
        })).toPromise();
    };
}
//# sourceMappingURL=check-login-intializer.js.map