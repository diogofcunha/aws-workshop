resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_lambda_layer_version" "ffmpeg_lambda_layer" {
  layer_name          = "ffmpeg_lambda_layer"
  s3_bucket           = "${aws_s3_bucket.bucket_bundles.bucket}"
  s3_key              = "ffmpeg-bundle"
  compatible_runtimes = ["nodejs8.10", "nodejs10.x"]
}
