@description('application name')
param name string

@description('The location to deploy the services to')
param location string

// for avoiding name collision
var uniqueSuffix = substring(uniqueString(resourceGroup().id), 0, 4)

@description('The tier for the cognitive service')
param cognitivetier string = 'F'

resource cognitiveServicesTranslation 'Microsoft.CognitiveServices/accounts@2022-03-01' = {
  name: '${name}translation${uniqueSuffix}'
  location: location
  kind: 'TextTranslation'
  sku: {
    name: cognitivetier == 'F' ? 'F0' : 'S1'
  }
  properties: {
    customSubDomainName: '${name}translation${uniqueSuffix}'
    publicNetworkAccess: 'Enabled'
  }
}

resource cognitiveServicesFormRecognizer 'Microsoft.CognitiveServices/accounts@2022-03-01' = {
  name: '${name}formreco${uniqueSuffix}'
  location: location
  kind: 'FormRecognizer'
  properties: {
    customSubDomainName: '${name}formreco${uniqueSuffix}'
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      ipRules: []
      virtualNetworkRules: []
    }
  }
  sku: {
    name: cognitivetier == 'F' ? 'F0' : 'S0'
  }
}

resource cognitiveServicesTextAnalytics 'Microsoft.CognitiveServices/accounts@2022-03-01' = {
  name: '${name}text${uniqueSuffix}'
  location: location
  kind: 'TextAnalytics'
  properties: {
    customSubDomainName: '${name}text${uniqueSuffix}'
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      ipRules: []
      virtualNetworkRules: []
    }
  }
  sku: {
    name: cognitivetier == 'F' ? 'F0' : 'S'
  }
}

resource cognitiveServicesSpeech 'Microsoft.CognitiveServices/accounts@2022-03-01' = {
  name: '${name}speech${uniqueSuffix}'
  location: location
  kind: 'SpeechServices'
  properties: {
    customSubDomainName: '${name}speech${uniqueSuffix}'
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      ipRules: []
      virtualNetworkRules: []
    }
  }
  sku: {
    name: cognitivetier == 'F' ? 'F0' : 'S0'
  }
}

output cognitiveServicesTranslationName string = 'https://${name}translation${uniqueSuffix}.cognitiveservices.azure.com/'
#disable-next-line outputs-should-not-contain-secrets
output cognitiveServicesTranslationKey string = listKeys(cognitiveServicesTranslation.id, cognitiveServicesTranslation.apiVersion).key1
output cognitiveServicesFormRecognizerName string = cognitiveServicesFormRecognizer.properties.endpoint
#disable-next-line outputs-should-not-contain-secrets
output cognitiveServicesFormRecognizerKey string = listKeys(cognitiveServicesFormRecognizer.id, cognitiveServicesFormRecognizer.apiVersion).key1
output cognitiveServicesTextAnalyticsName string = cognitiveServicesTextAnalytics.properties.endpoint
#disable-next-line outputs-should-not-contain-secrets
output cognitiveServicesTextAnalyticsKey string = listKeys(cognitiveServicesTextAnalytics.id, cognitiveServicesTextAnalytics.apiVersion).key1
#disable-next-line outputs-should-not-contain-secrets
output cognitiveServicesSpeechKey string = listKeys(cognitiveServicesSpeech.id, cognitiveServicesSpeech.apiVersion).key1
output cognitiveServicesSpeechRegion string = cognitiveServicesSpeech.location
