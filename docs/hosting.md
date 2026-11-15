# Hosting and environments

| Branch | Environment | URL | Indexed | Azure resource |
| --- | --- | --- | --- | --- |
| `staging` | `staging` | https://staging.jenp.ai | No (robots `Disallow`, `X-Robots-Tag: noindex`) | `swa-jenp-staging` |
| `main` | `production` | https://www.jenp.ai | Yes | `swa-jenp-production` |

Both are Azure Static Web Apps (Standard) in resource group `rg-jenp-site`, defined in `infra/main.bicep`. `.github/workflows/deploy.yml` builds with `DEPLOY_ENV` set from the branch and uploads `dist` using the GitHub environment secret `AZURE_STATIC_WEB_APPS_API_TOKEN`. Pull-request preview environments are disabled so unreviewed branches never get public URLs.

## Flow

1. Open a pull request to `staging`. Validation builds both environments.
2. Merge to `staging`; check https://staging.jenp.ai.
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

## DNS (GoDaddy)

jenp.ai DNS is hosted at GoDaddy (`domaincontrol.com`). Add:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `staging` | staging default hostname (`az staticwebapp show -n swa-jenp-staging -g rg-jenp-site --query defaultHostname -o tsv`) |
| CNAME | `www` | production default hostname (`az staticwebapp show -n swa-jenp-production -g rg-jenp-site --query defaultHostname -o tsv`) |

Use GoDaddy **Forwarding** (301, forward only) for the apex `jenp.ai` → `https://www.jenp.ai`, because GoDaddy cannot CNAME/ALIAS the apex.

After the CNAMEs resolve, set `bindCustomDomains = true` in `infra/main.bicepparam` and rerun the deployment command. Azure validates each CNAME and issues managed TLS certificates.
