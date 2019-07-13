import getAssetInfo from '../../server/asset-info'
import { getEventSourceObjectKey } from '../../server/utils/s3Events'

export const handle = async event => {
  const key = getEventSourceObjectKey(event)

  console.log('Generating info for key:', key)
  return await getAssetInfo(process.env.AWS_ASSET_BUCKET_NAME, key)
}
