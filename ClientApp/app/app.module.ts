import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MainFormComponent } from './main-form.component';
import { checkIfUserIsAuthenticated } from './check-login-intializer';
import { AccountService } from './account.service';

const appRoutes: Routes = [
    { path: '', component: MainFormComponent  },
   // { path: '', redirectTo: '/home', pathMatch: 'full'},
   // { path: 'home',  component: MainFormComponent },
    { path: ':id', component: MainFormComponent }
];


@NgModule({
    imports: [BrowserModule, FormsModule, HttpClientModule, RouterModule.forRoot(appRoutes)],
    declarations: [AppComponent, MainFormComponent],
    providers: [      
        {provide: APP_INITIALIZER, useFactory: checkIfUserIsAuthenticated, multi: true, deps: [AccountService],  }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }