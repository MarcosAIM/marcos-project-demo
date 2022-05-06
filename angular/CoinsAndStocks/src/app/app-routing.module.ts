import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo  } from '@angular/fire/compat/auth-guard';

const redirectLoggedInToDashboard = () => redirectLoggedInTo(['dashboard']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'register', component:RegisterComponent, ...canActivate(redirectLoggedInToDashboard) },
  {path: 'login', component:LoginComponent,  ...canActivate(redirectLoggedInToDashboard)},
  {path: 'dashboard', component:DashboardComponent, ...canActivate(redirectUnauthorizedToLogin)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
