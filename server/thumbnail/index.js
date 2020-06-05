import { S3 } from 'aws-sdk'
import { processThumbnail } from '../utils/ffmpeg'

const s3 = new S3({ region: process.env.AWS_REGION })

export default async function generateThumbnail (srcBucket, key) {
  const objectParams = {
    Bucket: srcBucket,
    Key: key
  }

  const { ContentType } = await s3.headObject(objectParams).promise()

  const src = await s3.getSignedUrl('getObject', {
    ...objectParams,
    Expires: 3600
  })

  const isVideo = !ContentType.includes('image')

  const data = await processThumbnail(src, isVideo)

  return await s3
    .putObject({
      Bucket: `${srcBucket}.thumbnails`,
      Key: key,
      Body: data,
      ContentType
    })
    .promise()
}
