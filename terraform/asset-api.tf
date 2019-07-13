resource "aws_iam_role" "iam_for_asset_api" {
  name = "iam_for_asset_api"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

data "archive_file" "asset_api_zip" {
  type        = "zip"
  source_file = "../functions/asset-api/dist/index.js"
  output_path = "../functions/asset-api/dist/index.zip"
}

resource "aws_lambda_function" "asset_api_lambda" {
  function_name = "asset_api"
  role          = "${aws_iam_role.iam_for_asset_api.arn}"
  handler       = "index.handle"

  filename         = "${data.archive_file.asset_api_zip.output_path}"
  source_code_hash = "${data.archive_file.asset_api_zip.output_base64sha256}"

  runtime    = "nodejs8.10"
  depends_on = ["aws_iam_role_policy_attachment.lambda_logs", "aws_cloudwatch_log_group.asset_api_log"]

  environment {
    variables = {
      AWS_ASSET_BUCKET_NAME = "fullstack.diogo.workshop"
    }
  }
}

resource "aws_cloudwatch_log_group" "asset_api_log" {
  name              = "/aws/lambda/asset_api_2"
  retention_in_days = 14
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = "${aws_iam_role.iam_for_asset_api.name}"
  policy_arn = "${aws_iam_policy.lambda_logging.arn}"
}

resource "aws_iam_policy" "asset_api_policy" {
  name = "asset_api_policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": ["${aws_s3_bucket.asset_bucket.arn}"]
    },
    {
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:HeadObject"
      ],
      "Effect": "Allow",
      "Resource": ["${aws_s3_bucket.asset_bucket.arn}/*"]
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem"
      ],
      "Resource": ["${aws_dynamodb_table.asset_info_table.arn}"]
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "s3_access" {
  role       = "${aws_iam_role.iam_for_asset_api.name}"
  policy_arn = "${aws_iam_policy.asset_api_policy.arn}"
}
