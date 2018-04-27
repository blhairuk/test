import {URLSearchParams} from 'url'

import installScriptTag from '../../install-script-tag'
import fetch from '../../shopify-api-fetch'
import {saveToken} from '../../db'

export default () => async ctx => {
  const {
    code, 
    hmac, 
    timestamp, 
    state, 
    shop
  } = ctx.query

  const {
    API_KEY, 
    API_SECRET_KEY,
    APP_PROXY_HOST,
  } = process.env

  const body = new URLSearchParams()
  body.append('client_id', API_KEY || '')
  body.append('client_secret', API_SECRET_KEY || '')
  body.append('code', code)

  const {access_token: token} = await fetch(shop, '/oauth/access_token', {
    body,
    method: 'POST'
  })

  await saveToken({
    shop, 
    token
  })

  await installScriptTag({
    shop,
    token
  })

  ctx.body = `Received token: ${token} for shop: ${shop}.`
}