import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product-service/product.service';
import { UserService } from '../../services/user-service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list.component',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  Products: Product[] = [];
  constructor(private router: Router, private productService: ProductService, private userService: UserService) {
    this.readProducts();
    this.getUser();
  }
  ngOnInit(): void { }
  readProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.Products = data;
    });
  }
  getUser() {
    if (this.userService.getCurrentUser() === null) {
      this.router.navigate(['/login']);
    }
  }

  edit(index: number) {
    const id = this.Products[index]._id;
    this.router.navigate(['/products/' + id + '/edit']);
  }

  delete(index: number) {
    const id = this.Products[index]._id;
    this.productService.deleteProduct(id).subscribe(() => {
      this.readProducts();
    });
  }
}
