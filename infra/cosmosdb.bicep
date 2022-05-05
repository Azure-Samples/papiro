@description('application name')
param name string

@description('The location to deploy the services to')
param location string

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2021-04-15' = {
  name: 'cosmos${name}'
  location: 'westus'
  properties: {
    enableFreeTier: false
    databaseAccountOfferType: 'Standard'
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: 'westus'
      }
    ]
  }
}

resource cosmosDB 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2021-04-15' = {
  name: '${cosmosAccount.name}/${name}db'
  properties: {
    resource: {
      id: '${name}db'
    }
    options: {
      throughput: 400
    }
  }
  resource imagecontainer 'containers' = {
    name: '${name}container'
    properties: {
      resource: {
        id: '${name}container'
        partitionKey: {
          paths: [
            '/gitHubUser'
          ]
          kind: 'Hash'
        }
        indexingPolicy: {
          indexingMode: 'consistent'
          includedPaths: [
            {
              path: '/*'
            }
          ]
        }
        defaultTtl: 10080
      }
    }
  }
}

output cosmosDBURI string = cosmosAccount.properties.documentEndpoint
#disable-next-line outputs-should-not-contain-secrets
output cosmosDBKey string = listKeys(cosmosAccount.id, cosmosAccount.apiVersion).primaryMasterKey
output cosmosDBName string = '${name}db'
output cosmosContainerName string = '${name}container'
