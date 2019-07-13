import Koa from 'koa'
import cors from '@koa/cors'
import assetApi from './asset-api'
import thumbnailApi from './thumbnail/router'

const app = new Koa()

app
  .use(cors())
  .use(assetApi.routes())
  .use(thumbnailApi.routes())

app.listen(5000)

console.log('Listening at port 5000')

export default app
