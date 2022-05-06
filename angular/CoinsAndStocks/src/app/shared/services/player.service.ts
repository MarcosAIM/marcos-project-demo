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
  playerObserve: Subject<string>;

  constructor(
    private aFirestore: AngularFirestore,
    private authService: AuthService,

  ) {
    this.playerObserve = this.PlayerObserveInit();
    this.playerUpdate();
  }

  PlayerObserveInit(){
      const player_id$ = new Subject<string>();
      const queryObservable = player_id$.pipe(
      switchMap(player_id => 
        this.aFirestore
        .collection('players', ref => ref.where('player_id', '==', player_id))
        .valueChanges()
      )
     );
      // subscribe to changes
      queryObservable.subscribe(queriedItems => {
        const playerQuery = queriedItems.pop() as Player;
        this.playerData = {
          coins: playerQuery.coins,
          email: playerQuery.email,
          displayName: playerQuery.displayName,
          stocks: playerQuery.stocks
        }
      });
      return player_id$;
  }

  playerUpdate(){
    this.playerObserve.next(this.authService.getPlayerId);
  }

  clearPlayerData(){
    this.playerData = null;
    console.log("CLEARED PLAYER DATA");
  }
}
