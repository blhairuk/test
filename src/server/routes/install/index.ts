export default () => async ctx => {
  const {shop} = ctx.query

  if (!shop) {
    ctx.body = 'Missing ?shop='
    return
  }

  const scope = 'read_products'

  const {
    API_KEY, 
    NONCE, 
    REDIRECT_URI
  } = process.env

  ctx.redirect(`https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${API_KEY}&scope=${scope}&redirect_uri=${REDIRECT_URI}&state=${NONCE}`)
}