import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { RouterModule } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext'; 
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button'; 
import { OnInit } from '@angular/core';
import { CartItem } from '../services/cart-item';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product';


@Component({
  selector: 'app-checkout-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FloatLabelModule, DropdownModule, 
            ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './checkout-wizard.component.html',
  styleUrl: './checkout-wizard.component.css'
})


export class CheckoutWizardComponent implements OnInit {

  ngOnInit(): void {
    // patchValue() -> fill only some fields of the form with values (can skip others)
    this.addressForm.patchValue({
      firstName: this.fakeUser.firstName,
      lastName: this.fakeUser.lastName,
      street: this.fakeUser.street,
      number: this.fakeUser.number,
      postalCode: this.fakeUser.postalCode,
      city: this.fakeUser.city,
      country: this.fakeUser.country 
    });

    this.cartItems = this.cartService.getAllCartItems();
    this.cartItems.forEach(item => {
    this.productService.getProductMetadata(item.id).subscribe((product: Product) => {
    this.products[item.id] = product;
      });
    });
  }


  fakeUser = {
    firstName: 'Max',
    lastName: 'Mustermann',
    street: 'Hauptstraße',
    number: '17',
    postalCode: '12345',
    city: 'Berlin',
    country: { name: 'Germany', code: 'DE' }
  };


  // current step of the wizard (1 = Address, 2 = Delivery & Payment, 3 = Summary)
  currentStep = 1;

  // mark if step 1 (Address) was successfully completed
  completeStep1 = false;

  // mark if step 2 (Delivery & Payment) was successfully completed
  completeStep2 = false;

  // controls whether the warning message under the address form is shown (after pressing next-button)
  showFormWarning = false;

  // controls whether the warning message under the payment form is shown
  showPaymentWarning = false;

  // stores the selected delivery option (e.g 'standard' or 'express')
  delivery: string = '';

  // stores the selected payment option (e.g 'card', 'paypal')
  payment: string = '';  



  countries: { name: string, code: string }[] = [
    { name: 'Germany', code: 'DE' },
    { name: 'Switzerland', code: 'CH' },
    { name: 'Austria', code: 'AT' },
  ];


  addressForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    street: new FormControl('', Validators.required),
    number: new FormControl('', [Validators.required, Validators.pattern('\\d+')]),
    postalCode: new FormControl('', [Validators.required, Validators.pattern('\\d+')]),
    city: new FormControl('', Validators.required),
    // Country must be selected by the user
    // It starts as null and expects an object like { name: 'Germany', code: 'DE' }
    country: new FormControl<{ name: string; code: string } | null>(null, Validators.required)
  });


  deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      time: '4-5 business days',
      price: 4.99,
      icon: 'pi pi-truck'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      time: '1-2 business days',
      price: 9.99,
      icon: 'pi pi-bolt'
    },
    {
      id: 'pickup',
      name: 'Store Pickup',
      time: 'ready for pickup in 2 hours',
      price: 0,
      icon: 'pi pi-map-marker'
    }
  ];

  paymentOptions = [
    { 
      id: 'card', 
      name: 'Credit Card', 
      icon: 'pi pi-credit-card'
     },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      icon: 'pi pi-paypal' 
    },
    { 
      id: 'apple', 
      name: 'Apple Pay', 
      icon: 'pi pi-apple' 
    }
  ];


  products: { [id: string]: Product } = {};
  cartItems: CartItem[] = [];



  constructor(private cartService: CartService, private productService: ProductService) {
    this.cartItems = this.cartService.getAllCartItems();
  }

  
  // navigates back to the previous page in browser history
  cancel() {
    window.history.back();
  }

  // goes back one step in the wizard, if not already at the first step
  goBack() {
  if (this.currentStep > 1) {
    this.currentStep--;
    }
  }

  completeAddressForm() {
    // show the general form warning if validation fails
    this.showFormWarning = true;
    
    //  mark all input fields as touched so validation errors become visible
    Object.values(this.addressForm.controls).forEach(control => {
      control.markAsTouched();
    });

    // if all fields are valid, mark step 1 as complete and move to step 2
    if (this.addressForm.valid) {
      this.completeStep1 = true;
      this.currentStep = 2;

      // hide the general form warning again
      this.showFormWarning = false;

      window.scrollTo({ top: 0 });
    }
  }

  completePaymentForm(valid: boolean | null) {
    this.showPaymentWarning = true;
    if (valid) {
      this.completeStep2 = true;
      this.currentStep = 3;
      this.showPaymentWarning = false;

      window.scrollTo({ top: 0 }); // we need this because we want to start at the top in next step and dont scroll first
    }
  }

  submitOrder() {
    this.cartService.clearCart();
    localStorage.removeItem('cartItems');
    this.currentStep = 1;
    this.completeStep1 = false;
    this.completeStep2 = false;
  }

  getDeliveryOption() {
    return this.deliveryOptions.find(option => option.id === this.delivery);
  }

  getPaymentOption() {
    return this.paymentOptions.find(option => option.id === this.payment);
  }

  getProduct(id: string): Product | undefined {
    return this.products[id];
  }

  getProductImage(color: string): string {
    return `./assets/products/images/${color}.webp`;
  }

  getTotalPrice(): number { // like in cart-page
    return this.cartItems.reduce((total, item) => {
      const product = this.getProduct(item.id);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }
}
