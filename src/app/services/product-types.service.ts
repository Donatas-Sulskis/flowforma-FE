import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductType } from '../interfaces/product-types.interface';
import { EndPoints } from '../enums/endpoint-enums';
import { LOCAL_HOST } from '../utils/constats';

@Injectable({
  providedIn: 'root',
})
export class ProductTypesService {
  constructor(private http: HttpClient) {}

  public getProductTypes(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(
      `${LOCAL_HOST}${EndPoints.ProductTypes}`
    );
  }

  public postProductType(body: { name: string }): Observable<ProductType[]> {
    return this.http.post<ProductType[]>(
      `${LOCAL_HOST}${EndPoints.ProductTypes}`,
      body
    );
  }
}
