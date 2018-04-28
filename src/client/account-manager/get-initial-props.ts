import * as fetch from 'node-fetch'
import {resolve} from 'url'
import {StaticRouter} from 'react-router'
import * as Shopify from 'shopify-api-node'

import {getToken} from '../../server/db'

const rechargeApiToken = process.env.RECHARGE_API_TOKEN
const {APP_PROXY_PATH} = process.env

const rechargeApi = async path => {
  const res = await fetch(`https://api.rechargeapps.com${path}`, {
    headers: {
      'content-type': 'application/json',
      'x-recharge-access-token': rechargeApiToken,
    }
  })
  const json = await res.json()
  const rootKey = Object.keys(json)[0]
  return json[rootKey]
}

export default async ctx => {
  const {
    customerHash,
    page
  } = ctx.params

  const customer = (await rechargeApi(`/customers?hash=${customerHash}`))[0]
  const data: any = {customer}
  const location = `${APP_PROXY_PATH}${ctx.request.path}`

  switch (page) {
    case 'history':
      data.orders = (await rechargeApi(`/orders?customer_id=${customer.id}`))
      break
    case 'subscriptions':
      data.subscriptions = (await rechargeApi(`/subscriptions?customer_id=${customer.id}`))
      break
  }

  return {
    customerHash,
    data,
    Router: StaticRouter,
    routerProps: {
      location,
      context: {},
    },
  }
}