resource "aws_s3_bucket" "asset_bucket" {
  bucket = "fullstack.diogo.workshop"
  acl    = "private"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}
