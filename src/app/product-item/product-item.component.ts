import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../services/product';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})

export class ProductItemComponent {

  @Input() product!: Product;
  @Input() selectedColorName?: string;

  
  // get Image based on selected color
  get imagePath(): string {
  if (this.selectedColorName) {
    const match = this.product.colors.find(
      (color) => color.color_name === this.selectedColorName
    );
    if (match) {
      return `./assets/products/images/${match.color_id}.webp`;
    }
  }

  // fallback
  return `./assets/products/images/${this.product.id}.webp`;
}

}
