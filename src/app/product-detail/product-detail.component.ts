import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product';
import { CartService } from '../services/cart.service';
import { CartItem } from '../services/cart-item';
import { Color } from '../services/color';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product!: Product;
  productId!: string;
  selectedColorId!: string;
  showZoomIcon = false;
  modalOpen = false;
  addedToCart = false;
  selectedSize: string = '';
  allColors: Color[] = [];
  allPossibleSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', "28", "30", "32", "34", "36", "38"];
  showSelectionWarning = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
  this.productId = this.route.snapshot.params['id'];

  this.productService.getColorsList().subscribe(colors => {
  this.allColors = colors;
});


  this.route.queryParams.subscribe((params) => {
    this.selectedColorId = params['color'];
  });

  this.productService.getProductMetadata(this.productId).subscribe({
    next: (product) => {
      this.product = product;

      // if no color was selected, use the first one
      if (!this.selectedColorId && product.colors.length > 0) {
        this.selectedColorId = product.colors[0].color_id;
      }
    },
    error: (err) => console.error('Product not found:', err)
  });
}

getColorClasses(colorId: string): any {
  return {
    selected: this.selectedColorId === colorId,
    disabled: this.isColorDisabled(colorId)
  };
}

isColorDisabled(colorId: string): boolean {
  return !this.product.colors.some(c => c.color_id === colorId);
}

getSizeClasses(size: string): any {
  return {
    selected: this.selectedSize === size,
    disabled: !this.isSizeAvailable(size)
  };
}

isSizeAvailable(size: string): boolean {
  return this.product.sizes.includes(size);
}

selectColor(colorId: string) {
  if (this.isColorDisabled(colorId)) return;
  this.selectedColorId = colorId;
  window.history.replaceState({}, '', `?color=${colorId}`);
}

selectSize(size: string) {
  if (!this.isSizeAvailable(size)) return;
  this.selectedSize = size;
}

tryAddToCart() {
  if (!this.canAddToCart()) {
    this.showSelectionWarning = true;
    setTimeout(() => this.showSelectionWarning = false, 3000);
    return;
  }
  this.addToCart();
}

canAddToCart(): boolean {
  return this.selectedColorId !== '' && this.selectedSize !== '';
}

addToCart() {
  this.cartService.addCartItem({
    id: this.product.id,
    color: this.selectedColorId,
    size: this.selectedSize,
    quantity: 1
  });

  this.addedToCart = true;
  setTimeout(() => this.addedToCart = false, 2000);
}



goBack(): void {
  this.location.back();
}

openModal(): void {
  this.modalOpen = true;
}

closeModal(): void {
  this.modalOpen = false;
}

}
