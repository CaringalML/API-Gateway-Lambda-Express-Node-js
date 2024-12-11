# outputs.tf
output "api_endpoint" {
  description = "API Gateway invoke URL"
  value       = aws_apigatewayv2_api.api.api_endpoint
}

output "custom_domain_url" {
  description = "Custom domain URL"
  value       = "https://${var.api_subdomain}.${var.domain_name}"
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.crud_api.function_name
}

output "cloudwatch_log_group" {
  description = "CloudWatch Log Group name"
  value       = aws_cloudwatch_log_group.api_logs.name
}