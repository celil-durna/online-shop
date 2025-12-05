import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms' // for input fields and validation
import { InputTextModule } from 'primeng/inputtext'; // for styling of input fields
import { FloatLabelModule } from 'primeng/floatlabel'; // for floated labels of input fields
import { RadioButtonModule } from 'primeng/radiobutton'; // buttons for choice of "Mr", "Mrs", "Other"
import { CalendarModule } from 'primeng/calendar'; // for birthdate
import { DropdownModule } from 'primeng/dropdown'; // for country
import { ButtonModule } from 'primeng/button'; // for Register button

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, 
            RadioButtonModule, CalendarModule, DropdownModule, ButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})

export class RegisterComponent {

  registerForm = new FormGroup({

    gender: new FormControl(''),
    //gender: new FormControl('', Validators.required),
    otherGender: new FormControl(''), 
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]), 
    password: new FormControl('', [Validators.required, Validators.minLength(8)]), // length of password minimum 8
    birthdate: new FormControl('', Validators.required), // valid date input is handled automatically by p-calendar and dateFormat
    street: new FormControl('', Validators.required),
    // for the following two: Validators.pattern(/\d+/) is also possible (and my old solution: '^[0-9]+$')
    // for the following two: just numbers are correct, but its also just possible to write numbers because of "type="number" in <input>
    number: new FormControl('', [ Validators.required, Validators.pattern('\\d+')]), 
    postalCode: new FormControl('', [ Validators.required, Validators.pattern('\\d+')]),
    city: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),

  });

  countries: { name: string, code: string }[] = [
    { name: 'Germany', code: 'DE' },
    { name: 'Switzerland', code: 'CH' },
    { name: 'Austria', code: 'AT' },
  ];

  onSubmit() {
    if (this.registerForm.invalid) {
      console.log("Form Invalid!!!");
    } else {
      console.log("Form Submitted", this.registerForm.value);
    }
  }

}
