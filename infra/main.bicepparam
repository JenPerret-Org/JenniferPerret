using './main.bicep'

param location = 'westus2'
param resourceGroupName = 'rg-jenp-site'
param skuName = 'Standard'
param productionDomain = 'www.jenperret.com'
param stagingDomain = 'staging.jenperret.com'
// Both CNAMEs resolve in Azure DNS and both domains are bound (Ready). Keep enabled.
param bindProductionDomain = true
param bindStagingDomain = true
