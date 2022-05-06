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
    try {
        this.aFireAuth
        .signInWithEmailAndPassword(email, password)
        .then((player)=>{
          this.playerId = player.user?.uid;
        });
    } 
    catch (error:any) {
      window.alert(error.message);
    }
  }

    // Register with email/password
    Register(email: string, password: string) {
      try {
          this.aFireAuth
          .createUserWithEmailAndPassword(email, password).then((player)=>{
            const newPlayerProfile = {
              player_id: player.user?.uid,
              display_name: "Koala",
              email: player.user?.email,
              coins: 100000,
              stocks: {}
            }
            this.playerId = player.user?.uid;
            this.aFirestore.collection('players').add(newPlayerProfile);
          });

      } 
      catch (error:any) {
        window.alert(error.message);
      }
    }

  // Log out
   LogOut() {
     console.log(this.playerId);
      this.aFireAuth.signOut().then(()=>{
      this.router.navigate(['register']);
      this.playerId = null;
    });
  }

  get isLoggedIn(): boolean {
    return (this.aFireAuth.currentUser !== null) ? true : false;
  }

  get getPlayerId(): string|any{
    return this.playerId;
  }

}
