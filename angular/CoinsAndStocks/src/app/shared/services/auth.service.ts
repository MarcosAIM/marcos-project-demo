import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private playerId: string|any;
  constructor(
    private aFirestore: AngularFirestore,
    private aFireAuth: AngularFireAuth,
    private router: Router,
  ) {
    var that = this;
    this.aFireAuth.user.subscribe({
      next(player) {
        if (player) {
          that.playerId = player.uid;
        } else {
          that.playerId = undefined;
        }
      }
    })
   }

    // Log In with email/password
   LogIn(email: string, password: string) {
    return this.aFireAuth.signInWithEmailAndPassword(email, password)
        .then((player)=>{
          this.playerId = player.user?.uid;
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
              stocks: []
            }
            this.playerId = player.user?.uid;
            this.aFirestore.collection('players').doc(player.user?.uid).set(newPlayerProfile);
          })
      .catch((error) => {
        window.alert(error.message);
      });
    }

  // Log out
   LogOut() {
    return this.aFireAuth.signOut()
    .then(res => this.playerId = null)
    .catch((error) => {
      window.alert(error.message);
    });
  }

  get isLoggedIn(): boolean {
    return (this.aFireAuth.currentUser !== null) ? true : false;
  }

  get getPlayerId(): string|any{
    return this.playerId;
  }

}
