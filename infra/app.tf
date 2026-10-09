resource "azurerm_resource_group" "frontend" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_static_web_app" "frontend" {
  name                = var.static_web_app_name
  resource_group_name = azurerm_resource_group.frontend.name
  location            = var.location
  sku_tier            = var.static_web_app_sku_tier
  sku_size            = var.static_web_app_sku_size

  tags = var.tags
}

# The workflow deploys the built files and uses this token to authenticate to SWA.
resource "github_actions_secret" "static_web_app_deployment" {
  repository      = var.github_repository
  secret_name     = var.github_actions_secret_name
  value           = azurerm_static_web_app.frontend.api_key
}

resource "github_actions_variable" "backend_url" {
  repository    = var.github_repository
  variable_name = "VITE_API_URL"
  value         = var.backend_url
}
