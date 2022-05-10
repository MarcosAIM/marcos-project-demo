import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";

import { AuthService } from "./shared/services/auth.service";
// Firebase services
import { AngularFireModule } from '@angular/fire/compat';
import { FireBaseModules } from "./firebase.modules";
// material modules
import { MaterialModules } from "./material.modules";



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModules,
    AngularFireModule.initializeApp(environment.firebase),
    FireBaseModules
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
