import Koa from 'koa'
import cors from '@koa/cors'
import assetApi from './asset-api'
import thumbnailApi from './thumbnail/router'
import assetInfoApi from './asset-info/router'

const app = new Koa()

app
  .use(cors())
  .use(assetApi.routes())
  .use(thumbnailApi.routes())
  .use(assetInfoApi.routes())

app.listen(5000)

console.log('Listening at port 5000')

export default app
