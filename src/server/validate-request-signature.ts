import * as crypto from 'crypto'

export default () => async (ctx, next) => {
  const {
    hmac, 
    signature
  } = ctx.query

  const {API_SECRET_KEY} = process.env

  const message = Object.keys(ctx.query)
    .filter(k => k !== 'signature' && k !== 'hmac')
    .map(k => `${k}=${ctx.query[k]}`)
    .sort()
    .join(hmac ? '&' : '')

  const digest = crypto
    .createHmac('SHA256', API_SECRET_KEY || '')
    .update(message)
    .digest('hex')

  if (digest !== signature && digest !== hmac) {
    return ctx.throw(400, 'invalid :signature or :hmac')
  }

  await next()
}