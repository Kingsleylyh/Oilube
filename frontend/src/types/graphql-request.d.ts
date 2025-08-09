declare module 'graphql-request' {
  export class GraphQLClient {
    constructor(url: string, options?: any);
    request<T = any>(query: string, variables?: Record<string, any>): Promise<T>;
  }
  export function gql(
    strings: TemplateStringsArray,
    ...placeholders: Array<string | number | boolean>
  ): string;
}


