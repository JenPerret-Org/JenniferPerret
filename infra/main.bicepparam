using './main.bicep'

param location = 'westus2'
param resourceGroupName = 'rg-jenp-site'
param skuName = 'Standard'
param productionDomain = 'www.jenp.ai'
param stagingDomain = 'staging.jenp.ai'
// Set to true and redeploy after the GoDaddy CNAME records resolve.
param bindCustomDomains = false
