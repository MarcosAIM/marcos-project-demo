import { Component, OnInit, Input, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogIn: FormGroup
  constructor(
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private ngZone: NgZone,
    private formBuilder: FormBuilder
  ) {
    this.formLogIn = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
   }

   async logIn() {
    await this.authService.LogIn(this.formLogIn.value.email, this.formLogIn.value.password);
     this.ngZone.run(() => {
       this.router.navigate(['dashboard']);
     });
  }

  ngOnInit(): void {
  }

}
