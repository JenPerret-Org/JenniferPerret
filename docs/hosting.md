# Hosting and environments

| Branch | Environment | URL | Indexed | Azure resource |
| --- | --- | --- | --- | --- |
| `staging` | `staging` | https://staging.jenperret.com | No (robots `Disallow`, `X-Robots-Tag: noindex`) | `swa-jenp-staging` |
| `main` | `production` | https://www.jenperret.com | Yes | `swa-jenp-production` |

Both are Azure Static Web Apps (Standard) in resource group `rg-jenp-site`, defined in `infra/main.bicep`. `.github/workflows/deploy.yml` builds with `DEPLOY_ENV` set from the branch and uploads `dist` using the GitHub environment secret `AZURE_STATIC_WEB_APPS_API_TOKEN`. Pull-request preview environments are disabled so unreviewed branches never get public URLs.

## Flow

1. Open a pull request to `staging`. Validation builds both environments.
2. Merge to `staging`; check https://staging.jenperret.com.
3. Open a pull request from `staging` to `main`; merge to release to production.

## Provision or update infrastructure

```powershell
az deployment sub create --name jenp-site --location westus2 --template-file infra/main.bicep --parameters infra/main.bicepparam
```

Store each site's deployment token in its GitHub environment (tokens are secrets; never commit them):

```powershell
$token = az staticwebapp secrets list --name swa-jenp-staging --resource-group rg-jenp-site --query properties.apiKey -o tsv
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --env staging --body $token
```

Repeat with `swa-jenp-production` and `--env production`.

## DNS and custom domains

The `jenperret.com` nameservers are hosted at GoDaddy. Set each CNAME to the corresponding Azure hostname:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `staging` | `gentle-stone-01b2d751e.5.azurestaticapps.net` |
| CNAME | `www` | `jolly-sky-0f8f78e1e.6.azurestaticapps.net` |

1. Add the staging record, set `bindStagingDomain = true` in `infra/main.bicepparam`, and redeploy after DNS resolves. Merge to `staging` and verify the site over HTTPS before production cutover.
2. The existing `www.jenperret.com` CNAME points to `jenperret.com`; replacing it changes existing traffic. Once production is deployed and ready, use Microsoft's [TXT-based zero-downtime domain validation](https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain#zero-downtime-migration) before replacing the `www` CNAME. Set `bindProductionDomain = true` and redeploy once the new CNAME resolves. Azure provides managed TLS certificates for the bound domains.
3. After the new production site is working, forward `jenperret.com`, `jenp.ai`, and any other desired domains to `https://www.jenperret.com`. Use permanent HTTPS redirects that preserve paths and query strings, and verify that the forwarding provider serves a valid certificate for each source hostname. A DNS CNAME alone does not provide an HTTP redirect or automatically bind a hostname in Azure.

The hostnames can also be retrieved with `az staticwebapp show -n <site-name> -g rg-jenp-site --query defaultHostname -o tsv`. Keep the staging and production binding flags enabled in the parameter file after each domain is bound.
