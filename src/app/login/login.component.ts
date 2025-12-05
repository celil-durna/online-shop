import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms'; // for input fields and validation
import { InputTextModule } from 'primeng/inputtext'; // for styling of input fields
import { FloatLabelModule } from 'primeng/floatlabel'; // for floated labels of input fields
import { ButtonModule } from 'primeng/button'; // for Login button

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {

  loginForm = new FormGroup({

    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),

  });

  onSubmit() {
    if (this.loginForm.invalid) {
      console.log('Form Invalid!!!');
    } else {
      console.log('Form Submitted', this.loginForm.value);
    }
  }
  
}
