import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject, switchMap } from 'rxjs';
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
  
    constructor(public superThis: AuthService) {
      this.playerData = null;
      this.playerSubject = null;
     }
  
    PlayerObserveInit(){
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
            displayName: playerQuery.displayName,
            stocks: playerQuery.stocks
          }
      });
      id$.next(this.superThis.getPlayerId);
      this.playerSubject = id$;
    }
  
    clearPlayerData(){
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
          that.playerService.PlayerObserveInit();
        } else {
          that.playerId = undefined;
        }
      }
    });
   }

    // Log In with email/password
   LogIn(email: string, password: string) {
    return this.aFireAuth.signInWithEmailAndPassword(email, password)
    .then((player)=> {
      this.playerId = player.user?.uid;
      this.playerService.PlayerObserveInit();
    })
    .catch ((error) => {
      window.alert(error.message);
    });
  }

    // Register with email/password
    Register(email: string, password: string) {
      return this.aFireAuth
          .createUserWithEmailAndPassword(email, password)
          .then((player)=>{
            const newPlayerProfile = {
              player_id: player.user?.uid,
              displayName: "Koala",
              email: player.user?.email,
              coins: 100000,
            }
            this.playerId = player.user?.uid;
            this.aFirestore.collection('players').doc(player.user?.uid).set(newPlayerProfile)
            .then(()=> this.playerService.PlayerObserveInit());
          })
      .catch((error) => {
        window.alert(error.message);
      });
    }

  // Log out
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
    console.log(this.aFireAuth.currentUser);
    return (this.aFireAuth.currentUser === null) ? false : true;
  }

  get getPlayerId(): string|any{
    return this.playerId;
  }

  async buyStock(stock_name:string, quantity:number){
    if (this.isLoggedIn){
      console.log(this.playerId);
      const playerDocRef = this.aFirestore.collection('players').doc(this.playerId);
      const playerStocksDocRef = playerDocRef.collection('playerStocks').doc(this.playerId + stock_name);
      const stockDocRef = this.aFirestore.collection('stocks').doc(stock_name);
      try{
        await this.aFirestore.firestore.runTransaction( async (transaction)=>{
          const playerDoc = await transaction.get(playerDocRef.ref);
          console.log(playerDoc);
          const stockDoc = await transaction.get(stockDocRef.ref);
          const playerStocksDoc = await transaction.get(playerStocksDocRef.ref);
          if (!playerDoc.exists){
            throw 'Player does not exist :(';
          }
          if (!stockDoc.exists){
            throw 'Stock does not exist :(';
          }
          const playerData = playerDoc.data() as Player;
          const stockData = stockDoc.data() as Stock;
          console.log(playerData);
          console.log(stockData);
          console.log(playerData.coins);
          console.log(stockData.value);
          const balance = playerData.coins - (stockData.value * quantity);
          console.log(balance);
          if(balance >= 0){
            transaction.update(playerDocRef.ref, {coins: balance});
            if(playerStocksDoc.exists){
              const playerStocks = playerStocksDoc.data() as playerStocks;
              const quantity_owned = playerStocks.quantity + quantity;
              transaction.update(playerStocksDocRef.ref, {quantity: quantity_owned });
            }
            else{
              const newStockOwned = {
                stock_name: stockData.stock_name,
                value: stockData.value,
                quantity: quantity
              }
              transaction.set(playerStocksDocRef.ref, newStockOwned);
            }
            return balance;
          }
          else{
            
            return Promise.reject("Not enough coins? XD");
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
}
