# providers.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  
  # You can add backend configuration here
  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "crud-api/terraform.tfstate"
  #   region = "ap-southeast-2"
  # }
}

provider "aws" {
  region = var.aws_region
}