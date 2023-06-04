import { Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { ProductType } from '../interfaces/product-types.interface';
import { Product } from '../interfaces/product.interface';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  public allProductTypes!: Observable<ProductType[]>;
  public isProductType: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private urlReg: RegExp =
    /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;

  public selectedProductType: BehaviorSubject<ProductType | undefined> =
    new BehaviorSubject<ProductType | undefined>(undefined);
  public productForm = new FormGroup({
    imageUrl: new FormControl('', [
      Validators.required,
      Validators.pattern(this.urlReg),
    ]),
    details: new FormControl('', [
      Validators.required,
      Validators.maxLength(200),
    ]),
    productType: new FormControl<number | undefined>(undefined, [
      Validators.required,
    ]),
  });
  public productTypeForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(10)]),
  });

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      productTypes: Observable<ProductType[]>;
      product?: Product;
      isProductType: boolean;
    }
  ) {
    this.isProductType.next(data.isProductType);
    this.allProductTypes = data.productTypes;
    if (data.product) {
      this.updateForm(data.product);
    }
  }

  public updateForm(data: Product): void {
    this.productForm.get('imageUrl')?.setValue(data.imageUrl);
    this.productForm.get('details')?.setValue(data.details);
    this.productForm.get('productType')?.setValue(data.productTypeId);

    this.allProductTypes.subscribe((productTypes) => {
      return this.selectedProductType.next(
        productTypes.find(
          (productType) => productType.id === data.productTypeId
        )
      );
    });
  }

  public selectOption(selectedValue: number): void {
    const productType = this.productForm.get('productType');
    if (productType && selectedValue) {
      productType.setValue(selectedValue);
    }
  }

  public selectedType(
    productType: number | string,
    selectedValue?: number | string
  ): number | string {
    return productType === selectedValue ? selectedValue : productType;
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public handleSubmit(): void {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm);
    } else if (this.productTypeForm.valid) {
      this.dialogRef.close(this.productTypeForm);
    } else {
      this.productForm.markAllAsTouched();
      this.productTypeForm.markAllAsTouched();
    }
  }
}
