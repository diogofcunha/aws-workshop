resource "aws_s3_bucket" "asset_bucket" {
  bucket = "fullstack.diogo.workshop"
  acl    = "private"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["POST"]
    allowed_origins = ["*"]
    expose_headers  = []
    max_age_seconds = 3000
  }

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}

resource "aws_s3_bucket" "asset_thumbnails_bucket" {
  bucket = "fullstack.diogo.workshop.thumbnails"
  acl    = "private"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["POST"]
    allowed_origins = ["*"]
    expose_headers  = []
    max_age_seconds = 3000
  }

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}
