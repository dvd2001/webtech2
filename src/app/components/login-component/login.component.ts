import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login.component',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });
  users: any = [];

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void { }

  get datas() { return this.loginForm.value; }

  onSubmit() {
    let currentUser = (JSON.stringify(this.loginForm.value?.username ?? ''));
    let currentPassword = (JSON.stringify(this.loginForm.value?.password ?? ''));

    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      for (let user of this.users) {
        if (currentUser === JSON.stringify(user.username) && currentPassword === JSON.stringify(user.password)) {
          this.userService.setCurrentUser(user);
          this.router.navigate(['/products']);
          return;
        }
      }
      const errorElement = document.getElementById('wrongDatas');
      if (errorElement) {
        errorElement.innerHTML = 'Wrong username or password!';
      }
    });
  }
}
