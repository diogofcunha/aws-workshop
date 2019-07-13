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
