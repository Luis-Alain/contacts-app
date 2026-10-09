variable "resource_group_name" {
  description = "Azure resource group for the frontend."
  type        = string
  default     = "rg-contacts-front"
}

variable "location" {
  description = "Azure region for the Static Web App."
  type        = string
  default     = "westus2"
}

variable "static_web_app_name" {
  description = "Globally unique Azure Static Web App name."
  type        = string
  default     = "contacts-front"
}

variable "static_web_app_sku_tier" {
  description = "Static Web App pricing tier."
  type        = string
  default     = "Free"
}

variable "static_web_app_sku_size" {
  description = "Static Web App pricing size."
  type        = string
  default     = "Free"
}

variable "backend_url" {
  description = "Public URL of the contacts API."
  type        = string
  default     = "https://contacts-api-15370.azurewebsites.net"
}

variable "github_owner" {
  description = "GitHub repository owner."
  type        = string
  default     = "Luis-Alain"
}

variable "github_repository" {
  description = "GitHub repository name without the owner."
  type        = string
  default     = "contacts-app"
}

variable "github_actions_secret_name" {
  description = "Existing secret name consumed by the deployment workflow."
  type        = string
  default     = "AZURE_STATIC_WEB_APPS_API_TOKEN_PURPLE_SKY_0DC1E101E"
}

variable "github_token" {
  description = "GitHub token with permission to manage repository Actions secrets and variables."
  type        = string
  sensitive   = true
  default     = null
}

variable "tags" {
  description = "Tags applied to Azure resources."
  type        = map(string)
  default = {
    application = "contacts-app"
    managed_by  = "terraform"
  }
}
