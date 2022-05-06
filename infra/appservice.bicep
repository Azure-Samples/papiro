@description('The location to deploy the services to')
param location string

@description('The name for the App')
param name string

var appServicePlanName = '${name}appservice'
var appServiceName = '${name}app'

param cosmosDBURI string = ''

param cosmosDBKey string = ''

param cosmosDBName string = ''

param cosmosContainerName string = ''

param storageAccountBlobURI string = ''

param storageAccountName string = ''

param storageAccountKey string = ''

param cognitiveServicesTranslationName string = ''

param cognitiveServicesTranslationKey string = ''

param cognitiveServicesFormRecognizerName string = ''

param cognitiveServicesFormRecognizerKey string = ''

param cognitiveServicesTextAnalyticsName string = ''

param cognitiveServicesTextAnalyticsKey string = ''

param cognitiveServicesSpeechKey string = ''

param cognitiveServicesSpeechRegion string = ''

param generationServiceEndpoint string = ''

param generationServiceEndpointKey string = ''

resource appServicePlan 'Microsoft.Web/serverfarms@2021-03-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  sku: {
    name: 'S1'
  }
  properties: {
    reserved: true
  }
}

resource appService 'Microsoft.Web/sites@2021-03-01' = {
  name: appServiceName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'node|16-lts'
      http20Enabled: true
      alwaysOn: true
      webSocketsEnabled: false
    }
    httpsOnly: true
  }
  resource appServiceAppSettings 'config' = {
    name: 'appsettings'
    kind: 'string'
    properties: {
      'SECRET_COOKIE_PASSWORD': '${toUpper(uniqueString(resourceGroup().id))}${toUpper(uniqueString(appServiceName))}${toUpper(uniqueString(appServicePlan.id))}'
      'COSMOS_DB_URI': cosmosDBURI
      'COSMOS_DB_KEY': cosmosDBKey
      'COSMOS_DB_NAME': cosmosDBName
      'COSMOS_CONTAINER_NAME': cosmosContainerName
      'STORAGE_ACCOUNT_BLOB_URI': storageAccountBlobURI
      'STORAGE_ACCOUNT_NAME': storageAccountName
      'STORAGE_ACCOUNT_KEY': storageAccountKey
      'TRANSLATION_SERVICE_NAME': cognitiveServicesTranslationName
      'TRANSLATION_SERVICE_KEY': cognitiveServicesTranslationKey
      'FORM_RECOGNIZER_KEY': cognitiveServicesFormRecognizerKey
      'FORM_RECOGNIZER_ENDPOINT': cognitiveServicesFormRecognizerName
      'LANGUAGE_SERVICE_KEY': cognitiveServicesTextAnalyticsKey
      'LANGUAGE_SERVICE_ENDPOINT': cognitiveServicesTextAnalyticsName
      'SPEECH_SERVICE_KEY': cognitiveServicesSpeechKey
      'SPEECH_SERVICE_REGION': cognitiveServicesSpeechRegion
      'TEXT_GENERATION_ENDPOINT': generationServiceEndpoint
      'TEXT_GENERATION_KEY': generationServiceEndpointKey
    }
  }
}
