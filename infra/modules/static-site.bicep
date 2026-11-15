param name string
param location string
param skuName string
param tags object

@description('Custom hostname to bind with CNAME validation. Leave empty until DNS points at this site.')
param customDomain string = ''

resource site 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: skuName
    tier: skuName
  }
  properties: {
    // GitHub Actions deploys a prebuilt artifact with a deployment token, so no repository link is needed.
    allowConfigFileUpdates: true
    // PR preview environments would expose unreviewed branches on public URLs.
    stagingEnvironmentPolicy: 'Disabled'
    publicNetworkAccess: 'Enabled'
  }
}

resource domain 'Microsoft.Web/staticSites/customDomains@2023-12-01' = if (!empty(customDomain)) {
  parent: site
  name: empty(customDomain) ? 'unused.invalid' : customDomain
  properties: {
    validationMethod: 'cname-delegation'
  }
}

output name string = site.name
output defaultHostname string = site.properties.defaultHostname
