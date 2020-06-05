import serverless from 'serverless-http'
import assetApi from '../../server/asset-api'
import Koa from 'koa'
import cors from '@koa/cors'

const app = new Koa()

app
  .use(cors())
  .use(assetApi.routes())
  .use(assetApi.allowedMethods())

app.listen(5000)

console.log('Listening at port 5000')

export const handle = serverless(app)
