import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login.component',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
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

  onsubmit() {
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
