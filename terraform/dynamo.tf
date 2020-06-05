resource "aws_dynamodb_table" "asset_info_table" {
  name           = "AssetInfo"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "AssetId"

  attribute {
    name = "AssetId"
    type = "S"
  }

  tags = {
    Name        = "asset_info_table"
    Environment = "dev"
  }
}
