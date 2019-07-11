# You can find a really good resource on configuring api gateway at https://learn.hashicorp.com/terraform/aws/lambda-api-gateway
# Creating a data reference to the lambda function we are going to associate with 
data "aws_lambda_function" "api" {
  function_name = "${var.function_name}"
}

# This will act as a container for all the api gateway object we will be creating next
resource "aws_api_gateway_rest_api" "rest_api" {
  name = "${var.name}"
}

# All incoming requests to API Gateway must match with a configured resource and method in order to be handled
# The following 2 resources make sure that all incoming requests will match a resource

# "{proxy+}" activates proxy behavior, which means that this resource will match any request path
resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  parent_id   = "${aws_api_gateway_rest_api.rest_api.root_resource_id}"
  path_part   = "{proxy+}"
}

# This will allow any request method to be used.
resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id   = "${aws_api_gateway_resource.proxy.id}"
  http_method   = "ANY"
  authorization = "NONE"
}

# We now need to make sure that the requests sent to our gateway are routed to the lambda created earlier.
# (type AWS_PROXY is the type used for lambda proxy integration)
resource "aws_api_gateway_integration" "lambda" {
  rest_api_id             = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id             = "${aws_api_gateway_method.proxy.resource_id}"
  http_method             = "${aws_api_gateway_method.proxy.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${data.aws_lambda_function.api.invoke_arn}"
}

# Unfortunately the proxy resource cannot match an empty path at the root of the API, for that reason we will need to create root resources for the method and integration
resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id   = "${aws_api_gateway_rest_api.rest_api.root_resource_id}"
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_root" {
  rest_api_id             = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id             = "${aws_api_gateway_method.proxy_root.resource_id}"
  http_method             = "${aws_api_gateway_method.proxy_root.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${data.aws_lambda_function.api.invoke_arn}"
}

resource "aws_lambda_permission" "lambda_permission" {
  statement_id  = "AllowAssetApiInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${data.aws_lambda_function.api.arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/*/* part allows invocation from any stage, method and resource path
  # within API Gateway REST API.
  source_arn = "arn:aws:execute-api:${var.context["aws_region"]}:${var.context["aws_account_id"]}:${aws_api_gateway_rest_api.rest_api.id}/*/*/*"
}

resource "aws_api_gateway_deployment" "api" {
  depends_on = [
    "aws_api_gateway_integration.lambda",
    "aws_api_gateway_integration.lambda_root",
  ]

  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  stage_name  = "api"
}

output "base_url" {
  value = "${aws_api_gateway_deployment.api.invoke_url}"
}
