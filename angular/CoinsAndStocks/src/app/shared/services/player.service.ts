import { Injectable} from '@angular/core';
import { Player } from '../player';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap, Subject } from 'rxjs';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  playerData:any;

  constructor(
    private aFirestore: AngularFirestore,
    private authService: AuthService,

  ) {
    this.PlayerObserveInit();
  }

  PlayerObserveInit(){
      const playerObservable = this.aFirestore.collection('players')
      .doc(this.authService.getPlayerId)
      .valueChanges();
      // subscribe to changes
      const that = this;
      playerObservable.subscribe(
        {next(player){
          const playerQuery = player as Player;
          that.playerData = {
            coins: playerQuery.coins,
            email: playerQuery.email,
            displayName: playerQuery.displayName,
            stocks: playerQuery.stocks
          }
        }
      }
    );
  }

  clearPlayerData(){
    this.playerData = null;
    console.log("CLEARED PLAYER DATA");
  }
}
