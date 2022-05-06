import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { PlayerService } from '../../shared/services/player.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(private authService: AuthService, public playerService: PlayerService) {}

  ngOnInit(): void {
  }

  onLogOut(){
    this.authService.LogOut();
    this.playerService.clearPlayerData();
  }

}
