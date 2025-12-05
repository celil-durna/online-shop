import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { CartItem } from '../services/cart-item';
import { Product } from '../services/product';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})

export class CartPageComponent {

  cartItems: CartItem[] = [];
  products: { [id: string]: Product } = {};
  shippingFee: number = 4.99;

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getAllCartItems();
    this.cartItems.forEach(item => {
      this.productService.getProductMetadata(item.id).subscribe(product => {
        this.products[item.id] = product;
      });
    });
  }

  getProduct(id: string): Product | undefined {
    return this.products[id];
  }

  getProductImage(color: string): string {
    return `./assets/products/images/${color}.webp`;
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.setCartItem({ ...item, quantity: item.quantity + 1 });
    this.loadCart();
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.setCartItem({ ...item, quantity: item.quantity - 1 });
    } else {
      this.cartService.removeCartItem(item);
    }
    this.loadCart();
  }

  removeItem(item: CartItem): void {
    this.cartService.removeCartItem(item);
    this.loadCart();
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      const product = this.getProduct(item.id);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  }

  getTotalPriceWithShipping(): number {
  return this.getTotalPrice() + this.shippingFee;
  }


  checkout(): void {
    
  }

}
