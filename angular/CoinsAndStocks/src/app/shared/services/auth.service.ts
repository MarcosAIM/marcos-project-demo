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
      this.playerData = player;
    })
   }

    // Sign in with email/password
  async LogIn(email: string, password: string) {
    try {
      const response = await this.aFireAuth
        .signInWithEmailAndPassword(email, password);
      this.ngZone.run(() => {
        this.router.navigate(['dashboard']);
      });
    } catch (error:any) {
      window.alert(error.message);
    }
  }
    // Sign up with email/password
    async Register(email: string, password: string) {
      try {
        const response = await this.aFireAuth
          .createUserWithEmailAndPassword(email, password);
      } catch (error:any) {

        window.alert(error.message);
      }
    }

      // Sign out
  async LogOut() {
    return await this.aFireAuth.signOut().then(()=>{
      this.router.navigate(['register']);
    });
  }

  get isLoggedIn(): boolean {
    const player = this.playerData
    return (player !== null) ? true : false;
  }
}
