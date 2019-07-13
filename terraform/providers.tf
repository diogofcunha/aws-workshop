variable "context" {
  type = "map"

  default = {
    aws_profile    = "fullstack_try"
    aws_account_id = "275679597069"
    aws_region     = "eu-west-1"
  }
}

provider "aws" {
  profile = "${var.context["aws_profile"]}"
  region  = "${var.context["aws_region"]}"
}
