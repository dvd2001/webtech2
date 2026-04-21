import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product-service/product.service';
import { UserService } from '../../services/user-service/user.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-list.component',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatCardModule,
    MatButtonModule
  ]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loadError = '';

  constructor(
    private router: Router,
    private productService: ProductService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (!this.getUser()) {
      return;
    }
    this.readProducts();
  }

  readProducts() {
    this.loadError = '';
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
        this.products = [];
        this.loadError = 'Products could not be loaded.';
        this.cdr.detectChanges();
      }
    });
  }

  getUser(): boolean {
    if (this.userService.getCurrentUser() === null) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  edit(index: number) {
    const id = this.products[index]._id;
    this.router.navigate(['/products/' + id + '/edit']);
  }

  delete(index: number) {
    const id = this.products[index]._id;
    this.productService.deleteProduct(id).subscribe(() => {
      this.readProducts();
    });
  }
}
