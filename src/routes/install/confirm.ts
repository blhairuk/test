import {Agent} from 'https'
import * as fetch from 'node-fetch'
import {URLSearchParams} from 'url'

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
    API_SECRET_KEY
  } = process.env

  const body = new URLSearchParams()
  body.append('client_id', API_KEY || '')
  body.append('client_secret', API_SECRET_KEY || '')
  body.append('code', code)

  const options = {
    agent: new Agent({rejectUnauthorized: false}), 
    body, 
    method: 'POST'
  }
  const res = await fetch(`https://${shop}/admin/oauth/access_token`, options)
  const {access_token: accessToken} = await res.json()

  ctx.body = accessToken
}