import { Component, Input, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { PlayerService } from '../../shared/services/player.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(
    private authService: AuthService,
    public playerService: PlayerService,
    private ngZone: NgZone,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.playerService.PlayerObserveInit();
  }

  onLogOut(){
    
    this.authService.LogOut().then(() => {
      
      this.router.navigate(['login']);
      this.playerService.clearPlayerData();
    })
  }
}
