# Frontend infrastructure

This Terraform configuration creates the Azure Static Web App and manages the
GitHub Actions configuration used to deploy it.

## Required credentials

Authenticate Azure with the usual Azure CLI or `ARM_*` environment variables.
Terraform also needs a GitHub token with permission to manage Actions secrets
and variables in `Luis-Alain/contacts-app`:

```bash
export GITHUB_TOKEN="..."
```

The GitHub token is used only by Terraform. For a fine-grained token, grant
repository **Secrets: Read and write** and **Variables: Read and write**
permissions. Alternatively, a classic token with the `repo` scope works for
this private repository. The Azure Static Web App deployment token is read
from Azure and stored automatically as the repository secret
`AZURE_STATIC_WEB_APPS_API_TOKEN_PURPLE_SKY_0DC1E101E`.

## Deploy

Run these commands from this directory:

```bash
terraform init
terraform plan
terraform apply
```

The configuration also creates or updates the GitHub Actions variable
`VITE_API_URL` with the current backend URL. Vite receives that value during
the GitHub Actions build.

Override defaults without committing secrets by using environment variables,
for example:

```bash
export TF_VAR_static_web_app_name="contacts-front-unique-name"
export TF_VAR_github_token="$GITHUB_TOKEN"
```
