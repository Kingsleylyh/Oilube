export interface Product {
  id: string;
  pName: string;
  mName: string;
  creationTime: string;
  curHolder: string;
  isDelivered: boolean;
  path: string[];
}

export interface ProductsQueryResult {
  products: Product[];
}


