import { Component, OnInit, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { RouterLink } from '@angular/router';

import { CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [ButtonModule, RouterLink, CommonModule],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.css',
})

export class MenubarComponent implements OnInit, OnDestroy {

  // Current number of items in the cart
  cartItemCount = 0;

  // Subscription to track and later unsubscribe from cart updates
  private cartSub?: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Subscribe to the cart item count observable to update the badge in real time
    this.cartSub = this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks when the component is destroyed
    this.cartSub?.unsubscribe();
  }
}

