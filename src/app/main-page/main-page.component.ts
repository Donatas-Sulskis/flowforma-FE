import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { ProductService } from '../services/product.service';
import { ProductTypesService } from '../services/product-types.service';
import {
  Product,
  ProductDisplay,
  ProductInfo,
} from '../interfaces/product.interface';
import { BehaviorSubject, Observable, forkJoin, map } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent {
  public allProducts: Observable<ProductDisplay[]>;
  public productTypeName: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  constructor(
    public dialog: MatDialog,
    public productService: ProductService,
    public productTypesService: ProductTypesService
  ) {
    this.allProducts = this.mapAllProducts();
  }

  public mapAllProducts(): Observable<ProductDisplay[]> {
    return forkJoin([
      this.productService.getProducts(),
      this.productTypesService.getProductTypes(),
    ]).pipe(
      map(([products, productTypes]) => {
        return products.map((product) => {
          return {
            id: product.id,
            imageUrl: product.imageUrl,
            details: product.details,
            productType: productTypes.find(
              (productType) => productType.id === product.productTypeId
            )?.name,
          };
        });
      })
    );
  }

  public handleDeleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe((response) => {
      if (response) {
        this.allProducts = this.mapAllProducts();
      }
    });
  }

  public handleUpdateProduct(id: number): void {
    const product = this.productService.getProduct(id);
    product.subscribe((product) => {
      const dialogRef = this.dialog.open(ModalComponent, {
        data: {
          productTypes: this.productTypesService.getProductTypes(),
          product,
        },
      });

      dialogRef.afterClosed().subscribe((result: FormGroup) => {
        if (result) {
          const mappedData = this.formatBeforeSubmit(result, id);
          this.productService
            .updateProduct(id, mappedData)
            .subscribe((value) => {
              if (value) {
                this.allProducts = this.mapAllProducts();
              }
            });
        }
      });
    });
  }

  public formatBeforeSubmit(result: FormGroup, id?: number): ProductInfo {
    return {
      ...(id ? { id } : {}),
      imageUrl: result.get('imageUrl')?.value,
      details: result.get('details')?.value,
      productTypeId: Number(result.get('productType')?.value),
    };
  }

  public openDialog(isProductType: boolean): void {
    if (isProductType) {
      const dialogRef = this.dialog.open(ModalComponent, {
        data: {
          isProductType,
          productTypes: this.productTypesService.getProductTypes(),
        },
      });

      dialogRef.afterClosed().subscribe((result: FormGroup) => {
        if (result) {
          this.productTypesService
            .postProductType({ name: result.get('name')?.value })
            .subscribe((value) => {
              if (value) {
                this.allProducts = this.mapAllProducts();
              }
            });
        }
      });
      return;
    }

    const dialogRef = this.dialog.open(ModalComponent, {
      data: { productTypes: this.productTypesService.getProductTypes() },
    });

    dialogRef.afterClosed().subscribe((result: FormGroup) => {
      if (result) {
        const mappedData = this.formatBeforeSubmit(result);
        this.productService.postProduct(mappedData).subscribe((value) => {
          if (value) {
            this.allProducts = this.mapAllProducts();
          }
        });
      }
    });
  }
}
