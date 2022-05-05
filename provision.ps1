param(
  [string]$location,
  [string]$name
)
az deployment sub create --location $location --template-file ./infra/main.bicep --parameters basename=$name location=$location