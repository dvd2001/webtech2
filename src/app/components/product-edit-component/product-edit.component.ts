import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service/product.service';
import { UserService } from '../../services/user-service/user.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-product-edit.component',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ProductEditComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.mainForm();
    this.getUser();
  }

  get myFrom() {
    return this.editProductForm.controls;
  }

  submitted = false;
  editProductForm!: FormGroup;
  matcher = new MyErrorStateMatcher();

  ngOnInit(): void { }

  mainForm() {
    this.editProductForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-Z]+$')]],
      quantity: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
      typeOfQuantity: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.editProductForm.valid) {
      return;
    } else {
      this.productService.createProduct(this.editProductForm.value).subscribe(
        (res) => {
          console.log('Product successfully created!');
          this.ngZone.run(() => this.router.navigateByUrl('/products'));
        }, (error) => { console.log(error); }
      );
    }
  }

  getUser() {
    if (this.userService.getCurrentUser() === null) {
      this.router.navigateByUrl('/login');
    }
  }
}
