module "asset_api_gateway" {
  source        = "../tf-modules/api-gateway"
  function_name = "${aws_lambda_function.asset_api_lambda.function_name}"
  name          = "asset_api_gateway"
  context       = "${var.context}"
}

output "base_url" {
  value = "${module.asset_api_gateway.base_url}"
}
