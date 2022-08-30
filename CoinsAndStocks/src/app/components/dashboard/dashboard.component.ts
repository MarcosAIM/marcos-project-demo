import { Component, Input, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { StocksService } from "../../shared/services/stocks.service";
import { PlayersService } from 'src/app/shared/services/players.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  columnsToDisplay = ['Name', 'Value'];
  constructor(
    public authService: AuthService,
    public stockService: StocksService,
    public playerService: PlayersService
    ) { }

  ngOnInit(): void {}
}
