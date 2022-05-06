import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from "./shared/services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'CoinsAndStocks';
  authService;
  constructor(authService:AuthService){
    this.authService = authService;
  }
  ngAfterViewInit() {}
}