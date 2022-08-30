import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Player } from "../player";


@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  public playersLeaderboard$:Observable<Player[]>;

  constructor(private aFirestore: AngularFirestore) {
    this.playersLeaderboard$ = 
      aFirestore.collection('players', ref => {
          let query : firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
          query = query.orderBy("coins", "desc");
          return query;
        }).valueChanges() as Observable<Player[]>;
  }
}
