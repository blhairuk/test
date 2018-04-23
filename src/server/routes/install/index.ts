export default () => async ctx => {
  const {
    scope, 
    shop
  } = ctx.query

  if (!shop) {
    ctx.body = 'Missing ?shop='
    return
  }

  if (!scope) {
    ctx.body = 'Missing ?scope='
    return
  }

  const {
    API_KEY, 
    NONCE, 
    REDIRECT_URI
  } = process.env

  ctx.redirect(`https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${API_KEY}&amp;scope=${scope}&amp;redirect_uri=${REDIRECT_URI}&amp;state=${NONCE}`)
}