import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-registration.component',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class RegistrationComponent implements OnInit {
  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z ]*$')]),
    username: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9]+$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9]+$')]),
  });
  constructor(private formBuilder: FormBuilder, private router: Router, private ngZone: NgZone, private userService: UserService) { this.mainForm(); }

  get myForm() { return this.registrationForm.controls; }

  submitted = false;
  createFrom: FormGroup | undefined;
  matcher = new MyErrorStateMatcher();

  ngOnInit(): void { }

  mainForm() {
    this.createFrom = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z ]*$')]],
      username: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9]+$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9]+$')]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (!this.createFrom?.valid) {
      return;
    } else {
      this.userService.createUser(this.createFrom?.value).subscribe(
        (res) => {
          console.log('User successfully created!');
          this.ngZone.run(() => this.router.navigateByUrl('/login'));
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

}
