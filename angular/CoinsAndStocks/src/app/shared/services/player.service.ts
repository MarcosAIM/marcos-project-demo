import { Injectable} from '@angular/core';
import { Player } from '../player';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subject, Observable, switchMap } from 'rxjs';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  playerData:any;
  playerSubject: Subject<string>;

  constructor(
    private aFirestore: AngularFirestore,
    private authService: AuthService,

  ) {
    this.playerSubject = this.PlayerObserveInit();
    this.playerSubject.next(this.authService.getPlayerId);
  }

  PlayerObserveInit(){
    const id$ = new Subject<string>();
    const playerObservable = id$.pipe(
      switchMap((id) =>{
        return this.aFirestore.collection('players').doc(id).valueChanges();
      })
    );
    // subscribe to changes
    playerObservable.subscribe((player) =>{
        const playerQuery = player as unknown as Player;
        this.playerData = {
          coins: playerQuery.coins,
          email: playerQuery.email,
          displayName: playerQuery.displayName,
          stocks: playerQuery.stocks
        }
    });
    return id$;
  }

  clearPlayerData(){
    this.playerData = null;
    this.playerSubject.unsubscribe();
    console.log("CLEARED PLAYER DATA");
    console.log("PLAYER OBSERV " +this.playerSubject.closed);
    console.log("PLAYER DATA " + this.playerData);
  }
}
