import { Injectable, Inject } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from './data.service';
import { ListOfTasks } from './listOfTasks';
import { TaskTo } from './listOfTasks';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AccountService } from './account.service';
import { environment } from './environment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'main-form',
    templateUrl: './main-form.component.html',
    providers: [DataService]
})
export class MainFormComponent implements OnInit, OnDestroy {

    oneList: ListOfTasks = new ListOfTasks();   
    allLists: ListOfTasks[];                
    tableMode: boolean = true;         

    addName: string;
    errorModel: boolean = false;

    isUserAuthenticated = false;
    isReadByrefMode = false;
    subscription: Subscription;
    userName: string;    
    idRef: string

    constructor(private dataService: DataService, private httpClient: HttpClient, private accountService: AccountService, private router: Router, private activeRoute: ActivatedRoute)
    {      
       
    }

    ngOnInit() {
        this.activeRoute.params.subscribe((params) => { this.idRef = params['id'] });
     
        if (this.idRef != null && this.idRef.length > 0) {            
            this.dataService.getListOfTasksByRef(this.idRef)
                .subscribe((data: ListOfTasks[]) => {
                    this.allLists = data; 
                    this.isReadByrefMode = true;
                });
          
        }
        else
        {
            this.subscription = this.accountService.isUserAuthenticated.subscribe(isAuthenticated => {
                this.isUserAuthenticated = isAuthenticated;
                if (this.isUserAuthenticated) {
                    this.httpClient.get(`${environment.apiUrl}/name`, { responseType: 'text', withCredentials: true }).subscribe(theName => {
                        this.userName = theName;
                        this.loadProducts();

                        this.accountService.getUserId()
                            .subscribe((data: string) => {
                                this.idRef = data;
                            });
                    });
                }
            });
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    logout() {
        this.accountService.logout();
    }
      
    login() {
        this.accountService.login();
    }

    // получаем данные через сервис
    loadProducts() {
        this.dataService.getListOfTasks()
            .subscribe((data: ListOfTasks[]) => this.allLists = data);
    }
    // сохранение данных
    save() {                                                                
        this.errorModel = false;
        let error = false;
       
        if (typeof this.oneList.tasksTo !== 'undefined' && this.oneList.tasksTo.length > 0) {
            error = this.oneList.tasksTo.some(l => l.name == null || l.name == "");
        }      
      
        if (error == true) {
            this.errorModel=true;
        }
        else
        {
            if (this.oneList.id == null) {             
                this.dataService.createListOfTasks(this.oneList)
                    .subscribe((data: ListOfTasks) => this.allLists.push(data));
            } else {
                this.dataService.updateListOfTasks(this.oneList)
                    .subscribe(data => this.loadProducts());
            }
            this.cancel(false);
        }
      
    }
    editList(l: ListOfTasks) {
        this.cancel(false);     
        this.tableMode = false;

        let count = 0;
        l.tasksTo.forEach(function (value) {
            value.idTable = count++;
        }); 

        this.oneList = l;
    }
    cancel(updateNeed: Boolean) {
        this.oneList = new ListOfTasks();
        this.tableMode = true;
        if (updateNeed)
        {
            this.loadProducts();
        }       
    }
    delete(p: ListOfTasks) {
        this.dataService.deleteListOfTasks(p.id)
            .subscribe(data => this.loadProducts());
    }
    add() {
        this.cancel(false);
        this.tableMode = false;
        this.oneList = new ListOfTasks();       
    }

    addTask(name: string) {       
        if (typeof this.oneList.tasksTo !== 'undefined' && this.oneList.tasksTo.length > 0)
        {
            let idmax = Math.max.apply(Math, this.oneList.tasksTo.map(function (o) { return o.idTable; }));
            this.oneList.tasksTo.push(new TaskTo(0, idmax+1,false, name));  
        }
        else
        {
            this.oneList.tasksTo = [new TaskTo(0, 0, false, name)];
        }  
    }
   
    deleteTask(t: TaskTo) {
        const index: number = this.oneList.tasksTo.indexOf(t);       
        if (index !== -1) {
            this.oneList.tasksTo.splice(index, 1);
        }     
    }

    saveLink() {       
        this.dataService.copyMessage(environment.Url + '/' + this.idRef);
    }

    createZipAndDownload() {
        this.dataService.getZipByRef(this.idRef).subscribe(data => {
            var a = document.createElement('a');
            var blob = new Blob([data], { type: "application/zip" });
            a.href = URL.createObjectURL(blob);
            a.download = this.userName;
            a.click();
        });
    }

}