export default () => async (ctx) => {
  const {shop} = ctx.query

  if (!shop) {
    ctx.body = "Missing ?shop="
    return
  }

  const scope = [
    "read_customers",
    "read_orders",
    "read_products",
    "write_customers",
    "write_orders",
    "write_script_tags",
  ].join(",")

  const {
    API_KEY,
    APP_PROXY_HOST,
    NONCE,
  } = process.env

  ctx.redirect([
    `https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${API_KEY}`,
    `scope=${scope}`,
    `redirect_uri=${APP_PROXY_HOST}/install/confirm`,
    `state=${NONCE}`,
  ].join("&"))
}
