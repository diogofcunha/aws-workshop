resource "aws_sns_topic" "bucket_event_topic" {
  name = "s3-event-notification-topic"

  policy = <<POLICY
{
    "Version":"2012-10-17",
    "Statement":[{
        "Effect": "Allow",
        "Principal": {"AWS":"*"},
        "Action": "SNS:Publish",
        "Resource": "arn:aws:sns:*:*:s3-event-notification-topic",
        "Condition":{
            "ArnLike":{"aws:SourceArn":"${aws_s3_bucket.asset_bucket.arn}"}
        }
    }]
}
POLICY
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = "${aws_s3_bucket.asset_bucket.id}"

  topic {
    topic_arn = "${aws_sns_topic.bucket_event_topic.arn}"
    events    = ["s3:ObjectCreated:*"]
  }
}

resource "aws_sqs_queue" "thumbnail_queue" {
  name                      = "thumbnail-queue"
  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

  tags = {
    Environment = "dev"
  }
}

resource "aws_sqs_queue_policy" "thumbnail_queue_policy" {
  queue_url = "${aws_sqs_queue.thumbnail_queue.id}"

  policy = <<JSON
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {"AWS":"*"},
          "Action": "sqs:SendMessage",
          "Resource": "${aws_sqs_queue.thumbnail_queue.arn}",
          "Condition": {
            "ArnEquals": {
              "aws:SourceArn": "${aws_sns_topic.bucket_event_topic.arn}"
            }
          }
        },
        {
          "Effect": "Allow",
          "Principal": {"AWS":"*"},
          "Action": [
            "sqs:GetQueueAttributes",
            "sqs:GetQueueUrl",
            "sqs:ReceiveMessage",
            "sqs:DeleteMessage"
          ],
          "Resource": "${aws_sqs_queue.thumbnail_queue.arn}"
        }
      ]
    }
    JSON
}

resource "aws_sns_topic_subscription" "thumbails_sqs_target" {
  topic_arn = "${aws_sns_topic.bucket_event_topic.arn}"
  protocol  = "sqs"
  endpoint  = "${aws_sqs_queue.thumbnail_queue.arn}"
}

resource "aws_lambda_event_source_mapping" "create_thumbnail" {
  event_source_arn = "${aws_sqs_queue.thumbnail_queue.arn}"
  function_name    = "${aws_lambda_function.thumbnail.arn}"
}

resource "aws_sqs_queue" "asset_info_queue" {
  name                      = "asset_info_queue"
  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

  tags = {
    Environment = "dev"
  }
}

resource "aws_sqs_queue_policy" "asset_info_queue_policy" {
  queue_url = "${aws_sqs_queue.asset_info_queue.id}"

  policy = <<JSON
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {"AWS":"*"},
          "Action": "sqs:SendMessage",
          "Resource": "${aws_sqs_queue.asset_info_queue.arn}",
          "Condition": {
            "ArnEquals": {
              "aws:SourceArn": "${aws_sns_topic.bucket_event_topic.arn}"
            }
          }
        },
        {
          "Effect": "Allow",
          "Principal": {"AWS":"*"},
          "Action": [
            "sqs:GetQueueAttributes",
            "sqs:GetQueueUrl",
            "sqs:ReceiveMessage",
            "sqs:DeleteMessage"
          ],
          "Resource": "${aws_sqs_queue.asset_info_queue.arn}"
        }
      ]
    }
    JSON
}

resource "aws_sns_topic_subscription" "asset_info_sqs_target" {
  topic_arn = "${aws_sns_topic.bucket_event_topic.arn}"
  protocol  = "sqs"
  endpoint  = "${aws_sqs_queue.asset_info_queue.arn}"
}
