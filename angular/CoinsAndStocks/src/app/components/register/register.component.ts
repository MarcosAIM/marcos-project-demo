import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    formBuilder: FormBuilder) {
  this.formRegister = formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirm: ['', Validators.required]
  })
}

  register() {
    return this.authService.Register(this.formRegister.value.email, this.formRegister.value.password);
  }

  ngOnInit(): void {
  }

}
