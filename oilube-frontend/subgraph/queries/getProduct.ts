import { gql } from 'graphql-request';
import graphClient from '../client'; // your GraphQL client
import { Product, ProductsQueryResult } from '../types';

const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    products(where: { id: $id }) {
      id
      pName
      mName
      creationTime
      curHolder
      isDelivered
      path
    }
  }
`;

export async function getProductById(id: string): Promise<Product | null> {
  const data = await graphClient.request<ProductsQueryResult>(GET_PRODUCT_BY_ID, { id });
  if (!data.products || data.products.length === 0) return null;
  return data.products[0];
}
