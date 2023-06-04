import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductInfo } from '../interfaces/product.interface';
import { LOCAL_HOST } from '../utils/constats';
import { EndPoints } from '../enums/endpoint-enums';
import { StatusCode } from '../interfaces/common.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${LOCAL_HOST}${EndPoints.Products}`);
  }

  public getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${LOCAL_HOST}${EndPoints.Products}/${id}`);
  }

  public postProduct(body: ProductInfo): Observable<Product> {
    return this.http.post<Product>(`${LOCAL_HOST}${EndPoints.Products}`, body);
  }

  public deleteProduct(id: number): Observable<StatusCode> {
    return this.http.delete<StatusCode>(
      `${LOCAL_HOST}${EndPoints.Products}/${id}`
    );
  }

  public updateProduct(id: number, body: ProductInfo): Observable<StatusCode> {
    return this.http.put<StatusCode>(
      `${LOCAL_HOST}${EndPoints.Products}/${id}`,
      body
    );
  }
}
