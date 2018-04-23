export default () => async ctx => {
  const {
    hmac,
    path_prefix: pathPrefix,
    timestamp, 
    signature,
    shop
  } = ctx.query

  if (pathPrefix) {
    ctx.body = `
  <div>
    <h1>Hey!</h1>
    <script>
      console.log(theme)
    </script>
  </div>`
    ctx.type = 'application/liquid'
    return
  }

  ctx.body = 'Hello'
}