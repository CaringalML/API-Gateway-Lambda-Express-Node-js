# variables.tf
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-2"
}

variable "project_name" {
  description = "Project name to be used for resource naming"
  type        = string
  default     = "crud-api"
}

variable "domain_name" {
  description = "Main domain name"
  type        = string
  default     = "martincaringal.co.nz"
}

variable "api_subdomain" {
  description = "Subdomain for the API"
  type        = string
  default     = "serverless"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "lambda_timeout" {
  description = "Lambda function timeout in seconds"
  type        = number
  default     = 30
}

variable "lambda_memory_size" {
  description = "Lambda function memory size in MB"
  type        = number
  default     = 256
}

variable "mongodb_uri" {
  description = "MongoDB connection string"
  type        = string
  sensitive   = true
}