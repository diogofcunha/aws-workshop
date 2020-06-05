import thumbnail from '../../server/thumbnail'
import { getEventSourceObjectKey } from '../../server/utils/s3Events'

export const handle = async event => {
  const key = getEventSourceObjectKey(event)

  console.log('Generating thumbnail for key:', key)
  return await thumbnail(process.env.AWS_ASSET_BUCKET_NAME, key)
}
