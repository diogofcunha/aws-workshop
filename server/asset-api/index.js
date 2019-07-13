import Router from 'koa-router'
import { S3, DynamoDB } from 'aws-sdk'
import { isInvalidContentType } from '../utils/validation'

const router = new Router()
const s3 = new S3({ region: process.env.AWS_REGION })

const dynamoClient = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
})

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

const getPresignedPost = contentType => {
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(
      {
        Bucket: process.env.AWS_ASSET_BUCKET_NAME,
        Fields: { key: String(Date.now()) },
        Conditions: [{ 'Content-Type': contentType }],
        Expires: 3000
      },
      (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      }
    )
  })
}

router.post('/upload', async ctx => {
  const contentType = ctx.query['content-type']

  if (isInvalidContentType(contentType)) {
    ctx.throw(400, 'Please supply a valid content type')
  }

  ctx.body = await getPresignedPost(contentType)
})

router.get('/info/:id', async ctx => {
  const { id } = ctx.params

  if (!id || Number.isNaN(Number(id))) {
    ctx.throw(400)
  }

  const assetInfo = await dynamoClient
    .get({
      TableName: 'AssetInfo',
      Key: { AssetId: id }
    })
    .promise()

  ctx.body = assetInfo.Item
})

export default router
