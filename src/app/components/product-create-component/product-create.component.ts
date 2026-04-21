import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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
  selector: 'app-product-create.component',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css',
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
export class ProductCreateComponent implements OnInit {
  submitError = '';

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.mainForm();
  }

  get myFrom() {
    return this.createProductForm.controls;
  }

  submitted = false;
  createProductForm!: FormGroup;
  matcher = new MyErrorStateMatcher();

  ngOnInit(): void {
    this.getUser();
  }

  mainForm() {
    this.createProductForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z ]+$')]],
      quantity: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
      typeOfQuantity: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.submitError = '';
    if (!this.createProductForm.valid) {
      this.createProductForm.markAllAsTouched();
      return;
    }

    this.productService.createProduct(this.createProductForm.getRawValue()).subscribe(
      () => {
        console.log('Product successfully created!');
        this.createProductForm.reset();
        this.ngZone.run(() => this.router.navigateByUrl('/products'));
      },
      (error) => {
        console.log(error);
        this.submitError = 'Product could not be created.';
      }
    );
  }

  getUser() {
    if (this.userService.getCurrentUser() === null) {
      this.router.navigateByUrl('/login');
    }
  }
}
