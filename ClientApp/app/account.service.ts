import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment';
import { tap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private _isUserAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    isUserAuthenticated: Observable<boolean> = this._isUserAuthenticatedSubject.asObservable();

    constructor(@Inject(DOCUMENT) private document: Document, private httpClient: HttpClient) { }

    updateUserAuthenticationStatus() {       
        return this.httpClient.get<boolean>(`${environment.apiUrl}/isAuthenticated`, { withCredentials: true }).pipe(tap(isAuthenticated => {           
            this._isUserAuthenticatedSubject.next(isAuthenticated);
        }));
    }

    setUserAsNotAuthenticated() {
        this._isUserAuthenticatedSubject.next(false);
    }

    login() {
        this.document.location.href = `${environment.apiUrl}/SignInWithGoogle`;
    } 

    logout() {
        this.document.location.href = `${environment.apiUrl }/LogOut`;
    }

    getUserId() {        
        return this.httpClient.get(`${environment.apiUrl}/GetUserId`, { responseType: 'text' });     
    }
 
    GetUserNameById(id: string) {
        return this.httpClient.get(`${environment.apiUrl} / GetUserNameById / + ${id}`, { responseType: 'text' });
    }
}
