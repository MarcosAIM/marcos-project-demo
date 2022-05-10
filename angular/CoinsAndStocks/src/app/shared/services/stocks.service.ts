import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Stock } from "../stocks";


@Injectable({
  providedIn: 'root'
})
export class StocksService {
  public stocks$:Observable<Stock[]>;
  greaterOrEqualThanFilter$:BehaviorSubject<any>;
  lesserOrEqualThanFilter$:BehaviorSubject<any>;

  constructor(private aFirestore: AngularFirestore) {
    this.greaterOrEqualThanFilter$ = new BehaviorSubject(null);
    this.lesserOrEqualThanFilter$ = new BehaviorSubject(null);
    this.stocks$ = combineLatest([
      this.greaterOrEqualThanFilter$,
      this.lesserOrEqualThanFilter$
    ]).pipe(
      switchMap( ([greaterOrEqual, lesserOrEqual]) => 
      aFirestore.collection('stocks', ref => {
          let query : firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
          if (greaterOrEqual) { query = query.where('value', '>=', greaterOrEqual ) };
          if (lesserOrEqual) { query = query.where('value', '<=', lesserOrEqual ) };
          return query;
        }).valueChanges()
      )
    ) as Observable<Stock[]>;
  }
  greaterThan(value: number) {
    this.greaterOrEqualThanFilter$.next(value); 
  }
  lesserThan(value: number) {
    this.lesserOrEqualThanFilter$.next(value); 
  }

}