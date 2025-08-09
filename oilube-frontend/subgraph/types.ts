// subgraph/types.ts

export interface Product {
  id: string;
  pName: string;
  mName: string;
  creationTime: string;  // or number if you want to convert timestamp
  curHolder: string;
  isDelivered: boolean;
  path: string[];
}

export interface ProductsQueryResult {
  products: Product[];
}
