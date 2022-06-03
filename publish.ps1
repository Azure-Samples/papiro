# Copyright 2022 (c) Microsoft Corporation.
# Licensed under the MIT license.
param(
  [string]$name
)
# clean package folder
if(Test-Path ./package) { Remove-Item -Path ./package -recurse -force }
New-Item -Path ./package -ItemType Directory

# build app
# - clean
if(Test-Path ./src/.next) { Remove-Item -Path ./src/.next -recurse -force }
Set-Location -Path ./src
# - build
yarn install
yarn build

# - zip
Get-ChildItem -exclude .env | Compress-Archive -CompressionLevel Optimal -DestinationPath ../package/app-zipdeploy.zip

Set-Location -Path ./..

# prompt for Azure account login
Connect-AzAccount

# - deploy
Publish-AzWebApp -ResourceGroupName $($name+"rg") -Name $($name+"app") -ArchivePath $pwd/package/app-zipdeploy.zip -Verbose