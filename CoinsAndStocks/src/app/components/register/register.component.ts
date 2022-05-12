import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {
  formRegister:FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    public ngZone: NgZone,
    private activeRoute: ActivatedRoute,
    formBuilder: FormBuilder) {
  this.formRegister = formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })
}

  register() {
    this.authService.Register(this.formRegister.value.email, this.formRegister.value.password)
    .then(res =>  this.router.navigateByUrl(
      this.activeRoute.snapshot.paramMap.get('callbackUrl') || ''))
  }

  ngOnInit(): void {
  }

}
