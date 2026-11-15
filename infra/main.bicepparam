using './main.bicep'

param location = 'westus2'
param resourceGroupName = 'rg-jenp-site'
param skuName = 'Standard'
param productionDomain = 'www.jenperret.com'
param stagingDomain = 'staging.jenperret.com'
// Enable each binding only after its CNAME resolves to the corresponding Azure site.
param bindProductionDomain = false
param bindStagingDomain = false
