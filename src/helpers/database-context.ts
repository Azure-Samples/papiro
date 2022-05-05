import { Container, CosmosClient } from '@azure/cosmos';

export const config = {
  key: process.env.COSMOS_DB_KEY,
  endpoint: process.env.COSMOS_DB_URI || '',
  databaseId: process.env.COSMOS_DB_NAME || '',
  containerId: process.env.COSMOS_CONTAINER_NAME || '',
  partitionKey: { kind: 'Hash', paths: ['/gitHubUser'] }
};

export async function createDbIfNotExists(): Promise<Container> {
  const client = new CosmosClient({ endpoint: config.endpoint, key: config.key });
  const { database } = await client.databases.createIfNotExists({
    id: config.databaseId
  });

  const { container } = await client
    .database(database.id)
    .containers.createIfNotExists(
      { id: config.containerId, partitionKey: config.partitionKey },
      { offerThroughput: 400 }
    );

  return container;
}

export function getCosmosDbContainer(): Container {
  const client = new CosmosClient({ endpoint: config.endpoint, key: config.key });

  const database = client.database(config.databaseId);
  return database.container(config.containerId);
}
