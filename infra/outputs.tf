output "static_web_app_default_hostname" {
  description = "Default hostname assigned to the Static Web App."
  value       = azurerm_static_web_app.frontend.default_host_name
}

output "static_web_app_url" {
  description = "HTTPS URL of the deployed frontend."
  value       = "https://${azurerm_static_web_app.frontend.default_host_name}"
}

output "resource_group_name" {
  description = "Frontend resource group name."
  value       = azurerm_resource_group.frontend.name
}
