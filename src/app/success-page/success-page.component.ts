import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-success-page',
  imports: [RouterModule],
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.css']
})
export class SuccessPageComponent {
  orderNumber: string = '';

  ngOnInit(): void {
    this.orderNumber = this.generateOrderNumber();
  }

  private generateOrderNumber(): string {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `ORD-${random}`;
  }
}
