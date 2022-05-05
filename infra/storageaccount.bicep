@description('application name')
param name string

@description('The location to deploy the services to')
param location string

// for avoiding name collision
var uniqueSuffix = substring(uniqueString(resourceGroup().id), 0, 4)

@description('The supported language for the translate-service, needed to create the output containers')
var supportedLanguages = [
  'en'
  'fr'
  'de'
  'pt'
  'es'
  'ja'
  'cs'
  'nl'
  'it'
  'pl'
]

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-08-01' = {
  name: '${name}storage${uniqueSuffix}'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }

  resource blobService 'blobServices' = {
    name: 'default'
    resource containerSource 'containers' = {
      name: 'source'
    }
    resource containerTarget 'containers' = [for language in supportedLanguages: {
      name: 'target${language}'
    }]
  }  
}


output storageAccountBlobURI string = storageAccount.properties.primaryEndpoints.blob
output storageAccountName string = storageAccount.name
#disable-next-line outputs-should-not-contain-secrets
output storageAccountKey string = listKeys(storageAccount.id, storageAccount.apiVersion).keys[0].value
