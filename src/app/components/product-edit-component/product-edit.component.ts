import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
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
    RouterLink,
    RouterLinkActive,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ProductEditComponent implements OnInit {
  productId = '';
  submitError = '';

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone
  ) {
    this.mainForm();
  }

  get myFrom() {
    return this.editProductForm.controls;
  }

  submitted = false;
  editProductForm!: FormGroup;
  matcher = new MyErrorStateMatcher();

  ngOnInit(): void {
    if (!this.getUser()) {
      return;
    }

    this.productId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    if (!this.productId) {
      this.router.navigateByUrl('/products');
      return;
    }

    this.productService.getProduct(this.productId).subscribe((product) => {
      this.editProductForm.patchValue(product);
    });
  }

  mainForm() {
    this.editProductForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      quantity: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0.0*-9.9*]+$')]],
      typeOfQuantity: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.submitError = '';
    if (!this.editProductForm.valid) {
      this.editProductForm.markAllAsTouched();
      return;
    }

    this.productService.updateProduct(this.productId, this.editProductForm.getRawValue()).subscribe(
      () => {
        console.log('Product successfully updated!');
        this.ngZone.run(() => this.router.navigateByUrl('/products'));
      }, (error) => {
        console.log(error);
        this.submitError = 'Product could not be updated.';
      }
    );
  }

  getUser(): boolean {
    if (this.userService.getCurrentUser() === null) {
      this.router.navigateByUrl('/login');
      return false;
    }

    return true;
  }
}
