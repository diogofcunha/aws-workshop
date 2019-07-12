import Router from 'koa-router'
import { S3 } from 'aws-sdk'

const router = new Router()
const s3 = new S3({ region: process.env.AWS_REGION })

router.get('/', async ctx => {
  const { Contents } = await s3
    .listObjects({
      Bucket: process.env.AWS_ASSET_BUCKET_NAME
    })
    .promise()

  const assets = await Promise.all(
    Contents.map(async o => {
      const key = o.Key

      const { ContentType } = await s3
        .headObject({ Bucket: process.env.AWS_ASSET_BUCKET_NAME, Key: key })
        .promise()

      const url = s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_ASSET_BUCKET_NAME,
        Key: key,
        Expires: 3000
      })

      return {
        url,
        type: ContentType.includes('image') ? 'image' : 'video',
        id: key
      }
    })
  )

  ctx.body = assets
})

export default router
