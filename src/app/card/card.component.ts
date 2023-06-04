import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.css'],
})
export class CardComponent {
  @Input() productType: string = '';
  @Input() productId: number = 0;
  @Input() productImageUrl: string = '';
  @Input() productDetails: string = '';
  @Output() public deleteProduct: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() public updateProduct: EventEmitter<number> =
    new EventEmitter<number>();
}
