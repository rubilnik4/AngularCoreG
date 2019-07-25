import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListOfTasks } from './listOfTasks';

@Injectable()
export class DataService {

    private urlTask = "/api/ListOfTasks";   

    constructor(private http: HttpClient) {
    }

    getListOfTasks() {
        return this.http.get(this.urlTask);
    }

    getListOfTasksByRef(id: string) {
        return this.http.get(this.urlTask + '/GetByRef/' + id);
    }

    createListOfTasks(listOfTasks: ListOfTasks) {

        return this.http.post(this.urlTask, listOfTasks);
    }
    updateListOfTasks(listOfTasks: ListOfTasks) {

        return this.http.put(this.urlTask + '/' + listOfTasks.id, listOfTasks);
    }
    deleteListOfTasks(id: number) {
        return this.http.delete(this.urlTask + '/' + id);
    }

    copyMessage(val: string) {
        let selBox = document.createElement('textarea');
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
    }

    getZipByRef(id: string) {
        return this.http.get(this.urlTask + '/GetZipByRef/' + id, {responseType: 'arraybuffer'});
    }   

   
}