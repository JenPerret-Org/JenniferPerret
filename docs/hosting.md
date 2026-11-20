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

## Retire GitHub Pages

PR #8 established the Azure implementation on `staging`. Production must retain that implementation when promoting to `main`; do not restore the old Pages workflow, `public/CNAME`, or `jenp.ai` canonical URLs.

The repository now uses only the Azure deployment workflow. Removing Pages code does not disable the already-published Pages site or change DNS.

1. Promote the Azure implementation to `main` and complete the domain cutover below. Verify both Azure sites over HTTPS.
2. After the new production site and redirects work, the owner should unpublish the old site in repository **Settings > Pages**. Do not retire the old host before traffic has moved.
3. Confirm subsequent `main` and `staging` pushes run **Deploy to Azure Static Web Apps**, with no Pages deployment.

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

The `jenperret.com` zone is hosted in Azure DNS (zone `jenperret.com`, resource group `aicraftworkstenant-rg`, in the same subscription as `rg-jenp-site`). The domain registration remains at GoDaddy. Current records:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `staging` | `gentle-stone-01b2d751e.5.azurestaticapps.net` |
| CNAME | `www` | `jolly-sky-0f8f78e1e.6.azurestaticapps.net` |

1. `staging.jenperret.com` is bound to `swa-jenp-staging` and serves HTTPS with an Azure-managed certificate.
2. `www.jenperret.com` is bound to `swa-jenp-production` and serves HTTPS with an Azure-managed certificate. Both binding flags in `infra/main.bicepparam` are enabled.
3. The apex `jenperret.com` still has A records pointing to GoDaddy's parking page. Forward `jenperret.com`, `jenp.ai`, and any other desired domains to `https://www.jenperret.com`. Use permanent HTTPS redirects that preserve paths and query strings, and verify that the forwarding provider serves a valid certificate for each source hostname. A DNS CNAME alone does not provide an HTTP redirect or automatically bind a hostname in Azure.

The hostnames can also be retrieved with `az staticwebapp show -n <site-name> -g rg-jenp-site --query defaultHostname -o tsv`. Keep the staging and production binding flags enabled in the parameter file after each domain is bound.
