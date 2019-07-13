resource "aws_iam_role" "iam_for_asset_info_lambda" {
  name = "iam_for_asset_info_lambda"

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

resource "aws_cloudwatch_log_group" "asset_info_group" {
  name              = "/aws/lambda/asset_info"
  retention_in_days = 14
}

resource "aws_iam_role_policy_attachment" "asset_info_lambda_logs" {
  role       = "${aws_iam_role.iam_for_asset_info_lambda.name}"
  policy_arn = "${aws_iam_policy.lambda_logging.arn}"
}

data "archive_file" "asset_info_lambda_zip" {
  type        = "zip"
  source_file = "../functions/asset-info/dist/index.js"
  output_path = "../functions/asset-info/dist/index.zip"
}

resource "aws_lambda_function" "asset_info" {
  function_name = "asset_info"
  role          = "${aws_iam_role.iam_for_asset_info_lambda.arn}"
  handler       = "index.handle"
  timeout       = 30
  memory_size   = 512

  filename         = "${data.archive_file.asset_info_lambda_zip.output_path}"
  source_code_hash = "${data.archive_file.asset_info_lambda_zip.output_base64sha256}"

  runtime    = "nodejs8.10"
  layers     = ["${aws_lambda_layer_version.ffmpeg_lambda_layer.arn}"]
  depends_on = ["aws_iam_role_policy_attachment.lambda_logs", "aws_cloudwatch_log_group.asset_info_group"]

  environment {
    variables = {
      AWS_ASSET_BUCKET_NAME = "fullstack.diogo.workshop"
    }
  }
}

resource "aws_iam_policy" "asset_info_lambda_iam_policy" {
  name = "asset_info_lambda_iam_policy"

  policy = <<EOF
{
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
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": ["${aws_s3_bucket.asset_bucket.arn}/*"]
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem"
      ],
      "Resource": ["${aws_dynamodb_table.asset_info_table.arn}"]
    },
    {
      "Effect": "Allow",
      "Action": [
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes"
      ],
      "Resource": ["${aws_sqs_queue.asset_info_queue.arn}"]
    }
  ],
  "Version": "2012-10-17"
}
EOF
}

resource "aws_iam_role_policy_attachment" "iam_policy_attachment_asset_info" {
  role       = "${aws_iam_role.iam_for_asset_info_lambda.name}"
  policy_arn = "${aws_iam_policy.asset_info_lambda_iam_policy.arn}"
}
