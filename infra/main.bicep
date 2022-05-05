targetScope = 'subscription'

@minLength(1)
@maxLength(17)
@description('Prefix for all resources, i.e. {name}storage')
param basename string

@minLength(1)
@description('Primary location for all resources')
param location string

resource resourceGroup 'Microsoft.Resources/resourceGroups@2020-06-01' = {
  name: '${basename}rg'
  location: location
}

module storage './storageaccount.bicep' = {
  name: '${resourceGroup.name}storage'
  scope: resourceGroup
  params: {
    name: toLower(basename)
    location: location
  }
}

module cosmosDB './cosmosdb.bicep' = {
  name: '${resourceGroup.name}cosmosdb'
  scope: resourceGroup
  params: {
    name: toLower(basename)
    location: location
  }
}

module cogSvcs './cognitiveservices.bicep' = {
  name: 'cogsvcsdeploy'
  scope: resourceGroup
  params: {
    name: toLower(basename)
    location: location
  }
}

module appService './appservice.bicep' = {
  name: 'appservicedeploy'
  scope: resourceGroup
  params: {
    location: location
    name: basename
    cosmosDBURI: cosmosDB.outputs.cosmosDBURI
    cosmosDBKey: cosmosDB.outputs.cosmosDBKey
    cosmosDBName: cosmosDB.outputs.cosmosDBName
    cosmosContainerName: cosmosDB.outputs.cosmosContainerName
    storageAccountBlobURI: storage.outputs.storageAccountBlobURI
    storageAccountName: storage.outputs.storageAccountName
    storageAccountKey: storage.outputs.storageAccountKey
    cognitiveServicesTranslationName: cogSvcs.outputs.cognitiveServicesTranslationName
    cognitiveServicesTranslationKey: cogSvcs.outputs.cognitiveServicesTranslationKey
    cognitiveServicesFormRecognizerKey: cogSvcs.outputs.cognitiveServicesFormRecognizerKey
    cognitiveServicesFormRecognizerName: cogSvcs.outputs.cognitiveServicesFormRecognizerName
    cognitiveServicesTextAnalyticsKey: cogSvcs.outputs.cognitiveServicesTextAnalyticsKey
    cognitiveServicesTextAnalyticsName: cogSvcs.outputs.cognitiveServicesTextAnalyticsName
    cognitiveServicesSpeechKey: cogSvcs.outputs.cognitiveServicesSpeechKey
    cognitiveServicesSpeechRegion: cogSvcs.outputs.cognitiveServicesSpeechRegion
    generationServiceEndpoint: 'genEndpoint'
    generationServiceEndpointKey: 'genEndpointKey'
  }
}
