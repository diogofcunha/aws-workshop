import { S3, DynamoDB } from 'aws-sdk'
import { getInfo } from '../utils/ffmpeg'

const s3 = new S3({ region: process.env.AWS_REGION })
const dynamoClient = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
})

export default async function getAssetInfo (srcBucket, key) {
  const objectParams = {
    Bucket: srcBucket,
    Key: key
  }

  const { ContentType } = await s3.headObject(objectParams).promise()

  const src = await s3.getSignedUrl('getObject', {
    ...objectParams,
    Expires: 3600
  })

  const data = await getInfo(src)

  return await dynamoClient
    .put({
      TableName: 'AssetInfo',
      Item: {
        AssetId: key,
        ...data,
        mimeType: ContentType,
        addedAt: Date.now()
      }
    })
    .promise()
}
