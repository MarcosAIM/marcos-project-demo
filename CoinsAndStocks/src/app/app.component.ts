import { AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import { AuthService } from "./shared/services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CoinsAndStocks';
  isLoggedIn:boolean;
  constructor(
    public authService: AuthService,
    private ngZone: NgZone,
    ){
      this.isLoggedIn = false;
     }
  OnInit(): void {
    this.isLoggedIn = (this.authService.isLoggedIn);
  }

  LogOut(){
    this.isLoggedIn = false;
    this.authService.LogOut().then(() =>
    this.ngZone.run(()=>window.location.reload()));
  }

  ngOnInit(): void {}
}