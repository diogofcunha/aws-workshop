import Router from 'koa-router'
import getAssetInfo from '.'

const router = new Router({ prefix: '/info' })

router.post('/:key', async ctx => {
  ctx.body = await getAssetInfo(
    process.env.AWS_ASSET_BUCKET_NAME,
    ctx.params.key
  )
})

export default router
