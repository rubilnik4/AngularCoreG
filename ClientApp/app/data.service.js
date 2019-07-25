var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
var DataService = /** @class */ (function () {
    function DataService(http) {
        this.http = http;
        this.urlTask = "/api/ListOfTasks";
    }
    DataService.prototype.getListOfTasks = function () {
        return this.http.get(this.urlTask);
    };
    DataService.prototype.getListOfTasksByRef = function (id) {
        return this.http.get(this.urlTask + '/GetByRef/' + id);
    };
    DataService.prototype.createListOfTasks = function (listOfTasks) {
        return this.http.post(this.urlTask, listOfTasks);
    };
    DataService.prototype.updateListOfTasks = function (listOfTasks) {
        return this.http.put(this.urlTask + '/' + listOfTasks.id, listOfTasks);
    };
    DataService.prototype.deleteListOfTasks = function (id) {
        return this.http.delete(this.urlTask + '/' + id);
    };
    DataService.prototype.copyMessage = function (val) {
        var selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    };
    DataService.prototype.getZipByRef = function (id) {
        return this.http.get(this.urlTask + '/GetZipByRef/' + id, { responseType: 'arraybuffer' });
    };
    DataService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], DataService);
    return DataService;
}());
export { DataService };
//# sourceMappingURL=data.service.js.map