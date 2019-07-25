var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from './data.service';
import { ListOfTasks } from './listOfTasks';
import { TaskTo } from './listOfTasks';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account.service';
import { environment } from './environment';
var MainFormComponent = /** @class */ (function () {
    function MainFormComponent(dataService, httpClient, accountService, router, activeRoute) {
        this.dataService = dataService;
        this.httpClient = httpClient;
        this.accountService = accountService;
        this.router = router;
        this.activeRoute = activeRoute;
        this.oneList = new ListOfTasks();
        this.tableMode = true;
        this.errorModel = false;
        this.isUserAuthenticated = false;
        this.isReadByrefMode = false;
    }
    MainFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activeRoute.params.subscribe(function (params) { _this.idRef = params['id']; });
        if (this.idRef != null && this.idRef.length > 0) {
            this.dataService.getListOfTasksByRef(this.idRef)
                .subscribe(function (data) {
                _this.allLists = data;
                _this.isReadByrefMode = true;
            });
        }
        else {
            this.subscription = this.accountService.isUserAuthenticated.subscribe(function (isAuthenticated) {
                _this.isUserAuthenticated = isAuthenticated;
                if (_this.isUserAuthenticated) {
                    _this.httpClient.get(environment.apiUrl + "/name", { responseType: 'text', withCredentials: true }).subscribe(function (theName) {
                        _this.userName = theName;
                        _this.loadProducts();
                        _this.accountService.getUserId()
                            .subscribe(function (data) {
                            _this.idRef = data;
                        });
                    });
                }
            });
        }
    };
    MainFormComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    MainFormComponent.prototype.logout = function () {
        this.accountService.logout();
    };
    MainFormComponent.prototype.login = function () {
        this.accountService.login();
    };
    // получаем данные через сервис
    MainFormComponent.prototype.loadProducts = function () {
        var _this = this;
        this.dataService.getListOfTasks()
            .subscribe(function (data) { return _this.allLists = data; });
    };
    // сохранение данных
    MainFormComponent.prototype.save = function () {
        var _this = this;
        this.errorModel = false;
        var error = false;
        if (typeof this.oneList.tasksTo !== 'undefined' && this.oneList.tasksTo.length > 0) {
            error = this.oneList.tasksTo.some(function (l) { return l.name == null || l.name == ""; });
        }
        if (error == true) {
            this.errorModel = true;
        }
        else {
            if (this.oneList.id == null) {
                this.dataService.createListOfTasks(this.oneList)
                    .subscribe(function (data) { return _this.allLists.push(data); });
            }
            else {
                this.dataService.updateListOfTasks(this.oneList)
                    .subscribe(function (data) { return _this.loadProducts(); });
            }
            this.cancel(false);
        }
    };
    MainFormComponent.prototype.editList = function (l) {
        this.cancel(false);
        this.tableMode = false;
        var count = 0;
        l.tasksTo.forEach(function (value) {
            value.idTable = count++;
        });
        this.oneList = l;
    };
    MainFormComponent.prototype.cancel = function (updateNeed) {
        this.oneList = new ListOfTasks();
        this.tableMode = true;
        if (updateNeed) {
            this.loadProducts();
        }
    };
    MainFormComponent.prototype.delete = function (p) {
        var _this = this;
        this.dataService.deleteListOfTasks(p.id)
            .subscribe(function (data) { return _this.loadProducts(); });
    };
    MainFormComponent.prototype.add = function () {
        this.cancel(false);
        this.tableMode = false;
        this.oneList = new ListOfTasks();
    };
    MainFormComponent.prototype.addTask = function (name) {
        if (typeof this.oneList.tasksTo !== 'undefined' && this.oneList.tasksTo.length > 0) {
            var idmax = Math.max.apply(Math, this.oneList.tasksTo.map(function (o) { return o.idTable; }));
            this.oneList.tasksTo.push(new TaskTo(0, idmax + 1, false, name));
        }
        else {
            this.oneList.tasksTo = [new TaskTo(0, 0, false, name)];
        }
    };
    MainFormComponent.prototype.deleteTask = function (t) {
        var index = this.oneList.tasksTo.indexOf(t);
        if (index !== -1) {
            this.oneList.tasksTo.splice(index, 1);
        }
    };
    MainFormComponent.prototype.saveLink = function () {
        this.dataService.copyMessage(environment.Url + '/' + this.idRef);
    };
    MainFormComponent.prototype.createZipAndDownload = function () {
        var _this = this;
        this.dataService.getZipByRef(this.idRef).subscribe(function (data) {
            var a = document.createElement('a');
            var blob = new Blob([data], { type: "application/zip" });
            a.href = URL.createObjectURL(blob);
            a.download = _this.userName;
            a.click();
        });
    };
    MainFormComponent = __decorate([
        Component({
            selector: 'main-form',
            templateUrl: './main-form.component.html',
            providers: [DataService]
        }),
        __metadata("design:paramtypes", [DataService, HttpClient, AccountService, Router, ActivatedRoute])
    ], MainFormComponent);
    return MainFormComponent;
}());
export { MainFormComponent };
//# sourceMappingURL=main-form.component.js.map