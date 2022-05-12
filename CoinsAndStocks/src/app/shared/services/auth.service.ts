import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';
import { Observable, Subject, switchMap } from 'rxjs';
import { Player } from '../player';
import { playerStocks, Stock } from '../stocks';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private playerId: string|any;

  public playerService = new  class {
    playerData:any;
    playerSubject: any;
    playerStocksData:any;
    playerStocksSubject:any;
    
    constructor(public superThis: AuthService) {
      this.playerData = null;
      this.playerSubject = null;
      this.playerStocksData = null;
      this.playerStocksSubject = null;
     }
    
    // Observe all the changes in player Data: coins and email.
    private PlayerObserveInit(){
      const id$ = new Subject<string>();
      const playerObservable = id$.pipe(
        switchMap((id) =>{
          return this.superThis.aFirestore.collection('players').doc(id).valueChanges();
        })
      );
      // subscribe to changes
      playerObservable.subscribe((player) =>{
          const playerQuery = player as unknown as Player;
          this.playerData = {
            coins: playerQuery.coins,
            email: playerQuery.email,
          }
      });
      id$.next(this.superThis.getPlayerId);
      this.playerSubject = id$;
      this.PlayerStockObserveInit();

    }

    // Observe all the changes in player stocks subcollection: all the stocks the player owns.
    private PlayerStockObserveInit(){
      const id$ = new Subject<string>();
      const playerObservable = id$.pipe(
        switchMap((id) =>{
          return this.superThis.aFirestore.collection('players').doc(id)
          .collection('playerStocks')
          .valueChanges();
        })
      );
      // subscribe to changes
      playerObservable.subscribe((player) =>{
          const playerQuery = player as unknown as playerStocks[];
          this.playerStocksData = playerQuery;
      });
      id$.next(this.superThis.getPlayerId);
      this.playerStocksSubject = id$;
    }

    // initialize both observers for login, registration, and revisiting website while logged in.
    public ObserveInit(){
      this.PlayerObserveInit();
      this.PlayerStockObserveInit();
    }

    // clear both observers for Logging out
    public clearPlayerData(){
      this.playerStocksData = null;
      this.playerStocksSubject.unsubscribe();
      this.playerStocksSubject = null;
      this.playerData = null;
      this.playerSubject.unsubscribe();
      this.playerSubject = null;
    }
  }(this);

  constructor(
    private aFirestore: AngularFirestore,
    public aFireAuth: AngularFireAuth,
  ) {
    var that = this;
    this.aFireAuth.user.subscribe({
      next(player) {
        if (player) {
          that.playerId = player.uid;
          that.playerService.ObserveInit();
        } else {
          that.playerId = undefined;
        }
      }
    });
   }

   LogIn(email: string, password: string) {
    return this.aFireAuth.signInWithEmailAndPassword(email, password)
    .then((player)=> {
      this.playerId = player.user?.uid;
      this.playerService.ObserveInit();
    })
    .catch ((error) => {
      window.alert(error.message);
    });
  }

    Register(email: string, password: string) {
      return this.aFireAuth
          .createUserWithEmailAndPassword(email, password)
          .then((player)=>{
            const newPlayerProfile = {
              player_id: player.user?.uid,
              email: player.user?.email,
              coins: 1000000,
            }
            this.playerId = player.user?.uid;
            this.aFirestore.collection('players').doc(player.user?.uid).set(newPlayerProfile)
            .then(()=> this.playerService.ObserveInit());
          })
      .catch((error) => {
        window.alert(error.message);
      });
    }

   LogOut() {
    return this.aFireAuth.signOut()
    .then(()=>{
      this.playerService.clearPlayerData();
      this.playerId = undefined;
    })
    .catch((error) => {
      window.alert(error.message);
    });
  }

  get isLoggedIn(): boolean {
    return (this.aFireAuth.currentUser === null) ? false : true;
  }

  get getPlayerId(): string|any{
    return this.playerId;
  }

  async buyStock(stock_name:string, quantity:number){
    if (this.isLoggedIn){
      const playerDocRef = this.aFirestore.collection('players').doc(this.playerId);
      const stockDocRef = this.aFirestore.collection('stocks').doc(stock_name);
      try{
        await this.aFirestore.firestore.runTransaction( async (transaction)=>{
          const playerDoc = await transaction.get(playerDocRef.ref);
          const stockDoc = await transaction.get(stockDocRef.ref);
          if (!playerDoc.exists){
            throw 'Player does not exist :(';
          }
          else if (!stockDoc.exists){
            throw 'Stock does not exist :(';
          }
          const playerData = playerDoc.data() as Player;
          const stockData = stockDoc.data() as Stock;

          const balance = playerData.coins - (stockData.value * quantity);

          const playerStocksDocRef = playerDocRef.collection('playerStocks')
          .doc(this.playerId + stock_name + stockData.value);
          const playerStocksDoc = await transaction.get(playerStocksDocRef.ref);
          
          if(balance >= 0){
            transaction.update(playerDocRef.ref, {coins: balance}); // update new balance of coins
            var quantity_owned = quantity;
            if(playerStocksDoc.exists){
              const playerStocks = playerStocksDoc.data() as playerStocks;
              quantity_owned += playerStocks.quantity_owned;
            }
            const newStockOwned = {
              name: stockData.name,
              value: stockData.value,
              quantity_owned: quantity_owned
            }
            transaction.set(playerStocksDocRef.ref, newStockOwned);
            const new_stock_price = stockData.value + (stockData.increasePerShare * quantity);
            transaction.update(stockDocRef.ref, {value:new_stock_price});
            return balance;
          }
          else{
            return Promise.reject("Not enough coins");
          }
        })
      }
      catch(error){
        window.alert(error);
      }
    }
    else{
      return window.alert("not logged in");
    }
  }
  async sellStock(stock_name:string, quantity:number, value:number){
    if (this.isLoggedIn){
      const playerDocRef = this.aFirestore.collection('players').doc(this.playerId);
      const playerStocksDocRef = playerDocRef.collection('playerStocks')
      .doc(this.playerId + stock_name + value);
      const stockDocRef = this.aFirestore.collection('stocks').doc(stock_name);
      try{
        await this.aFirestore.firestore.runTransaction( async (transaction)=>{
          const playerDoc = await transaction.get(playerDocRef.ref);
          const stockDoc = await transaction.get(stockDocRef.ref);
          const playerStocksDoc = await transaction.get(playerStocksDocRef.ref);
          if (!playerDoc.exists){
            throw 'Player does not exist. :(';
          }
          if (!stockDoc.exists){
            throw 'Stock does not exist. :(';
          }
          if(!playerStocksDoc.exists){
            throw 'Do not own this stock. :(';
          }
          const playerData = playerDoc.data() as Player;
          const stockData = stockDoc.data() as Stock;
          const playerStocks = playerStocksDoc.data() as playerStocks;
          const playerStocksData = playerStocksDoc.data() as playerStocks;
          var balance;

          const profit = ((stockData.increasePerShare * quantity)  * quantity);
          balance = playerData.coins + ((stockData.value * quantity)) - profit;
            
          console.log(stockData.value);
          console.log(playerStocksData.value);
          console.log(stockData.increasePerShare);
          console.log(quantity);
          console.log(balance);
          
          const quantity_left = playerStocksData.quantity_owned - quantity;
          if(quantity_left >= 0){
            transaction.update(playerDocRef.ref, {coins: balance});
            transaction.update(playerStocksDocRef.ref, {quantity_owned: quantity_left });
            const new_stock_price = stockData.value - (stockData.increasePerShare * quantity);
            transaction.update(stockDocRef.ref, {value:new_stock_price} );
            if(quantity_left === 0){
              transaction.delete(playerStocksDocRef.ref);
            }
            return balance;
          }
          else{
            return Promise.reject("Not enough stocks to sell.");
          }
        })
      }
      catch(error){
        window.alert(error);
      }
    }
    else{
      return window.alert("Not logged in");
    }
  }
}
