import {Agent} from 'https'
import * as fetch from 'node-fetch'

const {
  RECHARGE_API_TOKEN,
  STRIPE_API_TOKEN
} = process.env

export const rechargeApi = async (path, options = null) => {
  const res = await fetch(`https://api.rechargeapps.com${path}`, {
    headers: {
      'content-type': 'application/json',
      'x-recharge-access-token': RECHARGE_API_TOKEN,
    },
    ...options
  })
  const json = await res.json()
  const rootKey = Object.keys(json)[0]
  return json[rootKey]
}

export const shopifyApi = async (shop, path, options) => {
  options.agent = new Agent({rejectUnauthorized: false})
  const res = await fetch(`https://${shop}/admin/${path}`, options)
  return res.json()
}

export const stripeApi = async path => {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${STRIPE_API_TOKEN}`,
    }
  })
  return res.json()
}