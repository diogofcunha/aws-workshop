import Router from 'koa-router'
import generateThumbnail from '.'

const router = new Router({ prefix: '/thumbnail' })

router.get('/:key', async ctx => {
  ctx.body = await generateThumbnail(
    process.env.AWS_ASSET_BUCKET_NAME,
    ctx.params.key
  )
})

export default router
