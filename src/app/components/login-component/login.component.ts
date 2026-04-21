import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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
    RouterLink,
    RouterLinkActive,
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
    const currentUser = this.loginForm.value?.username ?? '';
    const currentPassword = this.loginForm.value?.password ?? '';
    const errorElement = document.getElementById('wrongDatas');
    if (errorElement) {
      errorElement.innerHTML = '';
    }

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        for (const user of this.users) {
          if (currentUser === user.username && currentPassword === user.password) {
            this.userService.setCurrentUser(user);
            this.router.navigate(['/products']);
            return;
          }
        }
        if (errorElement) {
          errorElement.innerHTML = 'Wrong username or password!';
        }
      },
      error: () => {
        if (errorElement) {
          errorElement.innerHTML = 'Login failed. Please check that the backend is running.';
        }
      }
    });
  }
}
