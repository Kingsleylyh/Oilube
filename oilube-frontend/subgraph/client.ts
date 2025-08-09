import { GraphQLClient } from 'graphql-request';

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/118186/oilubee/v.0.0.2'; // Your actual subgraph URL

const graphClient = new GraphQLClient(SUBGRAPH_URL);

export default graphClient;

