import { Injectable, NgZone } from '@angular/core';
import { Player } from '../player';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  playerData: any;
  constructor(
    public aFirestore: AngularFirestore,
    public aFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.aFireAuth.authState.subscribe((player)=>{
      if(player){
        this.playerData = player;
      }
      else{
        this.playerData = null;
      }
    })
   }

    // Log In with email/password
  async LogIn(email: string, password: string) {
    try {
      const response = await this.aFireAuth
        .signInWithEmailAndPassword(email, password).then((player)=>{
          this.playerData = {
            player_id: player.user?.uid,
            email: player.user?.email
          }
          console.log(this.playerData);
        });

    } catch (error:any) {
      window.alert(error.message);
    }
  }
    // Register with email/password
    async Register(email: string, password: string) {
      try {
        const response = await this.aFireAuth
          .createUserWithEmailAndPassword(email, password).then((player)=>{
            this.playerData = {
              player_id: player.user?.uid,
              email: player.user?.email
            }
            console.log(this.playerData);

          });

      } catch (error:any) {

        window.alert(error.message);
      }
    }

      // Log out
  async LogOut() {
    return await this.aFireAuth.signOut().then(()=>{
      this.router.navigate(['register']);
      this.playerData = null;
      console.log(this.playerData);
    });
  }

  get isLoggedIn(): boolean {
    return (this.playerData !== null) ? true : false;
  }
}
