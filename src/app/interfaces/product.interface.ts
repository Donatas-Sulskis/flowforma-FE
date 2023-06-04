export interface Product {
  id: number;
  imageUrl: string;
  details: string;
  productTypeId: number;
}

export type ProductInfo = Omit<Product, 'id'> & {
  id?: number;
};

export type ProductDisplay = Omit<Product, 'productTypeId'> & {
  productType?: string;
};
