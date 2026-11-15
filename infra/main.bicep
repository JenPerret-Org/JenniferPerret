targetScope = 'subscription'

@description('Azure region for the resource group and Static Web Apps.')
@allowed(['westus2', 'centralus', 'eastus2', 'westeurope', 'eastasia'])
param location string = 'westus2'

@description('Resource group that holds both site environments.')
param resourceGroupName string = 'rg-jenp-site'

@description('Static Web Apps plan for both environments.')
@allowed(['Free', 'Standard'])
param skuName string = 'Standard'

param productionDomain string = 'www.jenp.ai'
param stagingDomain string = 'staging.jenp.ai'

@description('Bind custom domains only after their CNAME records resolve to the default hostnames; validation fails otherwise.')
param bindCustomDomains bool = false

param tags object = {
  workload: 'jenp-ai'
  owner: 'jennifer-perret'
  managedBy: 'bicep'
}

resource group 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

module production 'modules/static-site.bicep' = {
  scope: group
  name: 'jenp-site-production'
  params: {
    name: 'swa-jenp-production'
    location: location
    skuName: skuName
    customDomain: bindCustomDomains ? productionDomain : ''
    tags: union(tags, { environment: 'production', branch: 'main' })
  }
}

module staging 'modules/static-site.bicep' = {
  scope: group
  name: 'jenp-site-staging'
  params: {
    name: 'swa-jenp-staging'
    location: location
    skuName: skuName
    customDomain: bindCustomDomains ? stagingDomain : ''
    tags: union(tags, { environment: 'staging', branch: 'staging' })
  }
}

output resourceGroupName string = group.name
output productionName string = production.outputs.name
output productionHostname string = production.outputs.defaultHostname
output stagingName string = staging.outputs.name
output stagingHostname string = staging.outputs.defaultHostname
