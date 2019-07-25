var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment';
import { tap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
var AccountService = /** @class */ (function () {
    function AccountService(document, httpClient) {
        this.document = document;
        this.httpClient = httpClient;
        this._isUserAuthenticatedSubject = new BehaviorSubject(false);
        this.isUserAuthenticated = this._isUserAuthenticatedSubject.asObservable();
    }
    AccountService.prototype.updateUserAuthenticationStatus = function () {
        var _this = this;
        return this.httpClient.get(environment.apiUrl + "/isAuthenticated", { withCredentials: true }).pipe(tap(function (isAuthenticated) {
            _this._isUserAuthenticatedSubject.next(isAuthenticated);
        }));
    };
    AccountService.prototype.setUserAsNotAuthenticated = function () {
        this._isUserAuthenticatedSubject.next(false);
    };
    AccountService.prototype.login = function () {
        this.document.location.href = environment.apiUrl + "/SignInWithGoogle";
    };
    AccountService.prototype.logout = function () {
        this.document.location.href = environment.apiUrl + "/LogOut";
    };
    AccountService.prototype.getUserId = function () {
        return this.httpClient.get(environment.apiUrl + "/GetUserId", { responseType: 'text' });
    };
    AccountService.prototype.GetUserNameById = function (id) {
        return this.httpClient.get(environment.apiUrl + " / GetUserNameById / + " + id, { responseType: 'text' });
    };
    AccountService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __param(0, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [Document, HttpClient])
    ], AccountService);
    return AccountService;
}());
export { AccountService };
//# sourceMappingURL=account.service.js.map