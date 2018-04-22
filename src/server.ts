import {Agent} from 'https'
import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as Router from 'koa-router'
import * as fetch from 'node-fetch'
import {URLSearchParams} from 'url'

import validateRequestSignature from './validate-request-signature'

const router = new Router()

router.get('/', ctx => {
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
    {{ collection }}
    <script>
      console.log(theme)
    </script>
  </div>`
    ctx.type = 'application/liquid'
    return
  }

  ctx.body = 'Hello'
})

router.get('/install', ctx => {
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
})

router.get('/install/confirm', async ctx => {
  const {
    code, 
    hmac, 
    timestamp, 
    state, 
    shop
  } = ctx.query

  const {
    API_KEY, 
    API_SECRET_KEY
  } = process.env

  const body = new URLSearchParams()
  body.append('client_id', API_KEY)
  body.append('client_secret', API_SECRET_KEY)
  body.append('code', code)

  const options = {
    agent: new Agent({rejectUnauthorized: false}), 
    body, 
    method: 'POST'
  }
  const res = await fetch(`https://${shop}/admin/oauth/access_token`, options)
  const {access_token: accessToken} = await res.json()

  ctx.body = accessToken
})

const app = new Koa()

app
  .use(logger())
  .use(validateRequestSignature())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)
