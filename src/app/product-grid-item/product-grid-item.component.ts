import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../services/product';

@Component({
  selector: 'app-product-grid-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-grid-item.component.html',
  styleUrl: './product-grid-item.component.css'
})

export class ProductGridItemComponent {
 
  @Input() product!: Product;
  @Input() selectedColorName?: string;

  // Display product picture based on selected color filter
  get imagePath(): string {
  if (this.selectedColorName) {
    const match = this.product.colors.find(
      (color) => color.color_name === this.selectedColorName
    );
    if (match) {
      return `./assets/products/images/${match.color_id}.webp`;
    }
  }
  return `./assets/products/images/${this.product.id}.webp`;
}
}
