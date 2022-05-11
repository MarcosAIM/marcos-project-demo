import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from "./shared/services/auth.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'CoinsAndStocks';
  isLoggedIn:boolean;
  constructor(
    public authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    ){
      this.isLoggedIn = false;
     }
  ngAfterViewInit(): void {
    this.isLoggedIn = (this.authService.isLoggedIn);
    console.log(this.isLoggedIn);
  }

  LogOut(){
    this.isLoggedIn = false;
    this.authService.LogOut().then(() => {
      this.router.navigate(['']);
      console.log(this.authService);
      window.location.reload();
    })
  }

  ngOnInit(): void {}
}