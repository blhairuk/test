export default (seconds) => async (ctx, next) => {
  ctx.set("Cache-Control", `public,max-age=${seconds},s-maxage=${seconds}`)
  await next()
}
