export default (url?: string) => async (ctx, next) => {
  if (url) {
    return ctx.redirect(url)
  }
  await next()
}
